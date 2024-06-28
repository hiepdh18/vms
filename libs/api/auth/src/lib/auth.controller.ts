import { Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../guards';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private services: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: Request & { user: LoginDto }) {
    return await this.services.login(request.user);
  }

  @UseGuards(AuthenticationGuard)
  @Post('logout')
  async logout(@Request() request: any) {
    const token = request.headers.authorization.split(' ')[1];
    return this.services.logout(token);
  }
}
