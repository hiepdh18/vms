import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AUTH_ERROR } from '@vms/shared/constants';
import { JwtPayload } from '@vms/shared/interfaces';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { AuthTokenEntity } from '../entities/authToken.entity';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env['JWT_SECRET'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const check = await AuthTokenEntity.query().findOne('token', token);
    if (!check)
      throw new UnauthorizedException({
        code: 10005,
        massage: AUTH_ERROR[10005],
      });

    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException({
        code: 10003,
        massage: AUTH_ERROR[10003],
      });
    }
    return { ...user };
  }
}
