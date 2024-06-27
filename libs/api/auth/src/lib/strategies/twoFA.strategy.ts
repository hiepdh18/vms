import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-strategy';
import { SharedAuthService } from '../shared-auth.service';

@Injectable()
export class TwoFAStrategy extends PassportStrategy(Strategy, '2fa') {
  constructor(private sharedAuthService: SharedAuthService) {
    super();
  }

  async validate(request: Request, options?: any): Promise<any> {
    const twoFaAuthToken = request.get('Two-Fa-Auth-Token');
    return this.sharedAuthService.verifyTwoFaAuthToken(twoFaAuthToken);
  }

  authenticate(req: Request, options?: any): any {
    this.success(this.validate(req));
  }
}
