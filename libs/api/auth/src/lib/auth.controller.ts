import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticationGuard, RefreshTokenGuard } from '../guards';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { TokenDto } from './dtos/token.dto';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private services: AuthService) {}

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@Request() request: any): Promise<TokenDto> {
    return await this.services.refreshTokens(
      request.user,
      request.user.refreshToken
    );
  }

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

  @UseGuards(AuthenticationGuard)
  @Get('test')
  test() {
    return 1;
  }
}
