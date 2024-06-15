// import { UsersService } from '@mq-vms/api-op/users';
// import { SharedAuthService } from '@mq-vms/api/shared/auth';
// import {
//   Injectable,
//   NestMiddleware,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class GetPermissionsMiddleware implements NestMiddleware {
//   constructor(
//     private readonly userService: UsersService,
//     private readonly sharedAuthService: SharedAuthService
//   ) {}
//   async use(req: Request, res: Response, next: NextFunction) {
//     const token = req.headers.authorization;
//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     const decoded = await this.sharedAuthService.verifyToken(
//       token.replace('Bearer ', '')
//     );
//     const user = await this.userService.findById(decoded.id);
//     req['userPermission'] = await user.getPermissions();
//     next();
//   }
// }
