import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PaginationQueryDto, TableData } from '@vms/shared/base';
import dayjs from 'dayjs';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';
import { USER_ERROR } from '@vms/shared/constants';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async findPaging(query: PaginationQueryDto): Promise<TableData<UserEntity>> {
    return await UserEntity.query().getForTable(query);
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<UserDto> {
    const user = await UserEntity.query()
      .where({ username: usernameOrEmail })
      .orWhere({ email: usernameOrEmail })
      .first();
    return new UserDto(user);
  }

  async findById(userId: number): Promise<UserDto> {
    const user = await UserEntity.query().findById(userId);
    return new UserDto(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserDto> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException({
        code: 11001,
        message: USER_ERROR[11001],
      });
    }
    const { email } = dto;
    if (email) {
      const checkEmail = await UserEntity.query()
        .where({ email: email?.trim() })
        .andWhereNot({ id })
        .first();
      if (checkEmail) {
        throw new BadRequestException({
          code: 11002,
          message: USER_ERROR[11002],
        });
      }
    }
    await UserEntity.query()
      .findById(id)
      .update({ ...dto, updatedAt: dayjs().toISOString() });
    return new UserDto();
  }

  async getUserPermissions(id: number) {
    const user = await UserEntity.query()
      .findById(id)
      .withGraphFetched('role.resources');
    const permissions: { [key: string]: number } = {};
    if (!user || !user?.role?.resources) return {};
    for (const per of user.role.resources) {
      permissions[per.key] = per.value || 0;
    }
    return permissions;
  }
}
