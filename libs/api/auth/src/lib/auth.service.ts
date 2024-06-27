import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';

interface CharToNum {
  O: number;
  C: number;
  R: number;
  U: number;
  D: number;
}
@Injectable()
export class AuthService {
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
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(_payload, {
        expiresIn: this.configService.get<string>('JWT_TIME') || '1d',
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
}
