import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_ERROR } from '@vms/shared/constants';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) {
      throw new UnauthorizedException({
        code: 10004,
        massage: AUTH_ERROR[10004],
      });
    }
    if (apiKey !== process.env['API_KEY']) {
      throw new UnauthorizedException({
        code: 10004,
        massage: AUTH_ERROR[10004],
      });
    }
    return true;
  }
}
