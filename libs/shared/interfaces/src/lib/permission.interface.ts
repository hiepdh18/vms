import { IResource } from './resource.interface';
import { IRole } from './role.interface';

export interface IPermission {
  id: number;
  roleId: number;
  role?: IRole;
  resourceId: number;
  resource?: IResource;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}
