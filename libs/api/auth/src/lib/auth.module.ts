import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@vms/api/users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret: process.env['JWT_SECRET'] }),
    ConfigModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AccessTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
