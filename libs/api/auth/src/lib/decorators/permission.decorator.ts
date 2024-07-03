import { SetMetadata } from '@nestjs/common';

export const Permissions = (permissions: { [x: string]: string }) =>
  SetMetadata('permissions', permissions);
