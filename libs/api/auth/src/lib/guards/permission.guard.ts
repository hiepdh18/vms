import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

const PERMISSION_CODE = {
  402: ' test',
};
@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private reflector: Reflector,
    private authServices: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler()
    );
    this.logger.log(
      `Required permissions: ${JSON.stringify(requiredPermissions)}`
    );

    if (!requiredPermissions) return true;
    const request = context.switchToHttp().getRequest();
    const userPermissions = request['userPermissions'];
    if (!userPermissions) {
      throw new ForbiddenException(
        JSON.stringify({ code: 402, message: PERMISSION_CODE[402] })
      );
    }
    this.logger.log(`User permissions: ${JSON.stringify(userPermissions)}`);
    return this.authServices.checkPermission(
      requiredPermissions,
      userPermissions
    );
  }
}
