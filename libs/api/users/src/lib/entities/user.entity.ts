import { BaseEntity } from '@vms/shared/base';
import { Roles } from '@vms/shared/constants';
import { IUser } from '@vms/shared/interfaces';
import { JSONSchema } from 'objection';
import dayjs = require('dayjs');
import { RoleEntity } from './role.entity';

export class UserEntity extends BaseEntity implements IUser {
  static override tableName = 'users';

  id!: number;
  username!: string;
  name!: string;
  password!: string;
  refreshToken!: string;
  email!: string;
  roleId!: number;
  settings: any;
  firstLogin!: boolean;
  lastLogin!: string;
  createdAt!: string;
  updatedAt!: string;

  // $formatJson(json) {
  //   // Remember to call the super class's implementation.
  //   json = super.$formatJson(json);
  //   // Do your conversion here.
  //   delete json.password;
  //   delete json.refreshToken;
  //   return json;
  // }

  static override get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      properties: {
        id: { type: 'number' },
        username: { type: 'string' },
        name: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        refreshToken: { type: ['string', 'null'] },
        roleId: { type: 'number' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        alarms: { type: 'array' },
        settings: { type: 'object' },
        firstLogin: { type: 'boolean' },
        twoFactAuthKey: { type: 'string' },
        // telegramId: { type: 'string' }
      },
    };
  }

  async getPermissions(): Promise<any> {
    return;
  }

  static override get relationMappings() {
    // const { RoleEntity } = require('@vms/api/users');
    return {
      role: {
        relation: BaseEntity.BelongsToOneRelation,
        modelClass: RoleEntity,
        join: {
          from: 'users.roleId',
          to: 'roles.id',
        },
      },
    };
  }

  static override get virtualAttributes() {
    return ['isLocked'];
  }

  isLocked() {
    const isRoleAdmin = this.roleId === Roles.ADMIN;
    if (isRoleAdmin) {
      return false;
    }

    let lastLogin: Date | string | null = this.lastLogin;
    if (!this.lastLogin) {
      lastLogin = this.createdAt;
    }

    const days = dayjs().diff(lastLogin, 'days');
    return days > 30 ? true : false;
  }
}
