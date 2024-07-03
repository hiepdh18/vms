import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@vms/api/users/entities';
import { JwtPayload } from '@vms/shared/interfaces';
import { compare, hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { LoginDto } from './dtos/login.dto';
import { TokenDto } from './dtos/token.dto';
import { AuthTokenEntity } from './entities/authToken.entity';

interface CharToNum {
  O: number;
  C: number;
  R: number;
  U: number;
  D: number;
}
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async createHash(str: string) {
    return await hash(str, process.env['SALT'] || 12);
  }

  async verifyHash(str: string, hash: string) {
    return await compare(str, hash);
  }

  async getTokens(payload: any) {
    const _payload = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      roleId: payload.roleId,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(_payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_TIME') || '1h',
      }),
      this.jwtService.signAsync(_payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TIME') || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyToken(tokenBearerAuth: string) {
    try {
      const token = await this.jwtService.verifyAsync(tokenBearerAuth, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return token;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  charToNum = { O: 16, C: 8, R: 4, U: 2, D: 1 };

  crudToDec = (text: string): number =>
    text
      .toUpperCase()
      .split('')
      .reduce(
        (total: number, char: string) =>
          total + this.charToNum[char as keyof CharToNum],
        0
      );
  decToCrud = (dec: number) => {
    let result = '';
    let char: 'O' | 'C' | 'R' | 'U' | 'D';
    for (char in this.charToNum) {
      if ((dec & this.charToNum[char]) == this.charToNum[char]) result += char;
    }
    return result;
  };

  hasPermission = (requirePermission: number, userPermission: number) => {
    return (userPermission & requirePermission) === requirePermission;
  };

  checkPermission(
    permissions: any,
    userPermissions: any
    // showError = false
  ): boolean {
    if (!permissions) return true;
    for (const permission in permissions) {
      const userPermission = userPermissions[permission];
      const requirePermission = this.crudToDec(permissions[permission]);
      if (!this.hasPermission(requirePermission, userPermission)) {
        throw new ForbiddenException({
          code: 10005,
          massage: "You don't have permission",
        });
      }
    }
    return true;
  }

  async login(dto: LoginDto) {
    const { username, password } = dto;
    const user = await UserEntity.query()
      .where({ username })
      .orWhere({ email: username })
      .first();
    if (!user)
      throw new BadRequestException({
        code: 3,
        message: 'Wrong username or password',
      });
    if (user.isLocked)
      throw new BadRequestException({
        code: 2,
        message: 'User has been locked.',
      });
    const checkPassword = await this.verifyHash(password, user.password);
    if (!checkPassword)
      throw new BadRequestException({
        code: 3,
        message: 'Wrong username or password',
      });
    const tokens = await this.getTokens(user);
    await AuthTokenEntity.query().insert({
      userId: user.id,
      token: tokens.accessToken,
    });
    const refreshTokenHashed = await this.createHash(tokens.refreshToken);

    this.logger.log(`hashed token: ${refreshTokenHashed}`);
    const now = dayjs().toISOString();
    await UserEntity.query().where('id', user.id).update({
      refreshToken: refreshTokenHashed,
      lastLogin: now,
      updatedAt: now,
    });

    return tokens;
  }

  async logout(token: string | string[]): Promise<boolean> {
    const authToken = await AuthTokenEntity.query()
      .where('token', token)
      .withGraphJoined('user')
      .where('user.isLocked', false)
      .first();
    if (!authToken) {
      throw new UnauthorizedException();
    }
    this.logger.log(authToken.token);
    await authToken.$query().delete();
    return true;
  }

  async refreshTokens(payload: any, refreshToken: string): Promise<TokenDto> {
    const user = await UserEntity.query().findById(payload.id);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    this.logger.log(refreshToken);
    const check = await this.verifyHash(refreshToken, user.refreshToken);
    this.logger.log(check);
    if (!check) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user);
    const hashToken = await this.createHash(tokens.refreshToken);
    await user
      .$query()
      .patch({ updatedAt: dayjs().toISOString(), refreshToken: hashToken });
    return new TokenDto(tokens);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await UserEntity.query().findOne({
      username: payload.username,
    });
    if (!user) return null;
    return user;
  }
}
