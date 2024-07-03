import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard, RefreshTokenGuard } from '../guards';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { TokenDto } from './dtos/token.dto';
import { LocalAuthGuard } from './guards/local.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private services: AuthService) {}

  @ApiOperation({ summary: 'Refresh token' })
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('refresh-token')
  @Get('refresh')
  async refresh(@Request() request: any): Promise<TokenDto> {
    return await this.services.refreshTokens(
      request.user,
      request.user.refreshToken
    );
  }

  @ApiOperation({ summary: 'Get tokens' })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: TokenDto, description: 'success' })
  @Post('login')
  async login(@Request() request: Request & { user: LoginDto }) {
    return await this.services.login(request.user);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticationGuard)
  @Post('logout')
  async logout(@Request() request: any): Promise<boolean> {
    const token = request.headers.authorization.split(' ')[1];
    return this.services.logout(token);
  }
}
