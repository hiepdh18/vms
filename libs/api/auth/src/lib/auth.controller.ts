import { hash } from 'bcryptjs';
import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private services: AuthService) {}
  @Post('login')
  async login() {
    const username = 'test';
    const email = 'test';
    const token = await this.services.getTokens({ username, email, id: 1 });
    return token;
  }

  @Post('very')
  async very() {
    const check = await this.services.verifyToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0IiwiaWF0IjoxNzE5NDE2ODc3LCJleHAiOjE3MjAwMjE2Nzd9.RgCzEvJMx6g6T0g2630oOEbS-zYfN99HO3xf7j_xbrU'
    );
    console.log('🚀 [CHECKING] check =>', check);
    return 1;
  }
}
