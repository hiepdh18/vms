import { BaseEntity } from '@vms/shared/base';
import { IResource } from '@vms/shared/interfaces';

export class ResourceEntity extends BaseEntity implements IResource {
  static override tableName = 'resources';
  id!: number;
  key!: string;
  desc!: string;
  value?: number;
  groupKey!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
