import { BaseEntity } from '@vms/shared/base';
import { IPermission, IResource, IRole } from '@vms/shared/interfaces';

export class PermissionEntity extends BaseEntity implements IPermission {
  static override tableName = 'permissions';

  id: number;
  roleId: number;
  role?: IRole | undefined;
  resourceId: number;
  resource?: IResource | undefined;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}
