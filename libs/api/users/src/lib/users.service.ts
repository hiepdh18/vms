import { Injectable, Logger } from '@nestjs/common';
import { PaginationQueryDto, TableData } from '@vms/shared/base';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dtos/user.dto';
import dayjs from 'dayjs';
import { JwtPayload } from '@vms/shared/interfaces';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  async findPaging(query: PaginationQueryDto): Promise<TableData<UserEntity>> {
    return await UserEntity.query().getForTable(query);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await UserEntity.query().findOne({
      username: payload.username,
    });
    if (!user) return null;
    return user;
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<UserDto> {
    const user = await UserEntity.query()
      .where({ username: usernameOrEmail })
      .orWhere({ email: usernameOrEmail })
      .first();
    return new UserDto(user);
  }

  async afterLogin(userId: number, refreshTokenHashed: string): Promise<void> {
    const now = dayjs().toISOString();
    await UserEntity.query().where('id', userId).update({
      refreshToken: refreshTokenHashed,
      lastLogin: now,
      updatedAt: now,
    });
  }
}
