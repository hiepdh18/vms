import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '@vms/api/auth';
import { UsersService } from '@vms/api/users';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class GetPermissionsMiddleware implements NestMiddleware {
  constructor(
    private readonly userServices: UsersService,
    private readonly authServices: AuthService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    req['userPermissions'] = {};
    const token = req.headers.authorization;
    if (token) {
      try {
        const decoded = await this.authServices.verifyToken(
          token.replace('Bearer ', '')
        );
        const userPermissions = await this.userServices.getUserPermissions(
          decoded.id
        );
        req['userPermissions'] = userPermissions;
      } catch (error) {
        //
      }
    }
    next();
  }
}
