import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SharedAuthService } from '../shared-auth.service';
import { PERMISSION_CODE } from '../utils/permission-code';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly sharedAuthService: SharedAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermission) return true;
    if (requiredPermission.length === 0) return true;
    const request = context.switchToHttp().getRequest();
    const userPermission = request['userPermission'];
    if (!userPermission) {
      throw new ForbiddenException(
        JSON.stringify({ code: 402, message: PERMISSION_CODE[402] }),
      );
    }
    this.sharedAuthService.checkPermission(
      requiredPermission[0],
      userPermission,
    );
    return true;
  }
}
