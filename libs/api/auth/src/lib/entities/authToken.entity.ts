import { UserEntity } from '@vms/api/users/entities';
import { BaseEntity } from '@vms/shared/base';
import { IAuthToken } from '@vms/shared/interfaces';

export class AuthTokenEntity extends BaseEntity implements IAuthToken {
  static override tableName = 'auth_tokens';

  userId!: number;
  token!: string;

  static override get relationMappings() {
    return {
      user: {
        relation: BaseEntity.BelongsToOneRelation,
        modelClass: UserEntity,
        join: {
          from: 'auth_tokens.userId',
          to: 'users.id',
        },
      },
    };
  }
}
