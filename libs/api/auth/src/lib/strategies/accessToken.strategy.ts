/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '@vms/api/users';
import { UserEntity } from '@vms/api/users/entities';
import { JwtPayload } from '@vms/shared/interfaces';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userServices: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env['JWT_SECRET'],
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userServices.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
