import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@vms/api/users';
import { isEmpty } from '@vms/shared/utils';
import { compare, hash } from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
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
    private configService: ConfigService,
    private readonly userServices: UsersService
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
        expiresIn: this.configService.get<string>('JWT_TIME') || '1h',
      }),
      this.jwtService.signAsync(_payload, {
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
      const token = await this.jwtService.verifyAsync(tokenBearerAuth);
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
    userPermissions: any,
    showError = false
  ): any {
    if (!permissions) return true;
    for (const permission in permissions) {
      const userPermission = userPermissions[permission];
      const requirePermission = this.crudToDec(permissions[permission]);
      if (!this.hasPermission(requirePermission, userPermission)) {
        throw new ForbiddenException({ statusCode: 10005 });
      }
      return true;
    }
  }

  async login(dto: LoginDto) {
    const { username, password } = dto;
    const user = await this.userServices.findByUsernameOrEmail(username);
    if (isEmpty(user))
      throw new BadRequestException({
        code: 3,
        message: 'Wrong username or password',
      });
    this.logger.log(`username: ${user.username}`);
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
    await this.userServices.afterLogin(user.id, refreshTokenHashed);
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
    this.logger.log(authToken.token)
    await authToken.$query().delete();
    return true;
  }
}
