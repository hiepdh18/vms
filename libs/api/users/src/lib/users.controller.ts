import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { Permissions } from '@vms/api/auth';
import { AuthenticationGuard, PermissionsGuard } from '@vms/api/auth/guards';
import { PaginationQueryDto, TableData } from '@vms/shared/base';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private services: UsersService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async paging(
    @Query() query: PaginationQueryDto
  ): Promise<TableData<UserEntity>> {
    this.logger.log(JSON.stringify(query));
    return await this.services.findPaging(query);
  }

  @Permissions({ manage_cameras: 'R' })
  @Get('test')
  test() {
    this.logger.log('TEST');
    return 1;
  }
}
