import { BaseEntity } from '@vms/shared/base';
import { IRole } from '@vms/shared/interfaces';
import { PermissionEntity } from './permission.entity';
import { ResourceEntity } from './resource.entity';

export class RoleEntity extends BaseEntity implements IRole {
  static override tableName = 'roles';

  id!: number;
  name!: string;
  key!: string;
  desc!: string;
  resources!: [ResourceEntity];
  createdAt!: Date;
  updatedAt!: Date;

  static override get relationMappings() {
    return {
      resources: {
        relation: this.ManyToManyRelation,
        modelClass: ResourceEntity,
        join: {
          from: 'roles.id',
          through: {
            from: 'permissions.roleId',
            to: 'permissions.resourceId',
            extra: ['value'],
          },
          to: 'resources.id',
        },
      },
      permissions: {
        relation: this.HasManyRelation,
        modelClass: PermissionEntity,
        join: {
          from: 'roles.id',
          to: 'permissions.roleId',
        },
      },
      // users: {
      //   relation: this.HasManyRelation,
      //   modelClass: UserEntity,
      //   join: {
      //     from: 'roles.id',
      //     to: 'users.roleId',
      //   },
      // },
    };
  }
}
