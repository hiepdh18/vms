import { Injectable, Logger } from '@nestjs/common';
import { PaginationQueryDto, TableData } from '@vms/shared/base';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  async findPaging(query: PaginationQueryDto): Promise<TableData<UserEntity>> {
    return await UserEntity.query().getForTable(query);
  }
}
