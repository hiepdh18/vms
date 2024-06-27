import { ApiKeyGuard } from '@vms/api/auth';
import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { PaginationQueryDto, TableData } from '@vms/shared/base';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private service: UsersService) {}

  @Get()
  @UseGuards(ApiKeyGuard)
  async paging(
    @Query() query: PaginationQueryDto
  ): Promise<TableData<UserEntity>> {
    this.logger.log(JSON.stringify(query));
    return await this.service.findPaging(query);
  }
}
