import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { Permissions } from '@vms/api/auth';
import { AuthenticationGuard, PermissionsGuard } from '@vms/api/auth/guards';
import { PaginationQueryDto, TableData } from '@vms/shared/base';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PagingDto } from './dtos/paging.dto';

class X implements TableData<UserEntity> {
  data: UserEntity[];
  total: number;
  page: number;
  pageSize: number;
}
@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private services: UsersService) {}

  @ApiOperation({ summary: 'Get users pagination' })
  @Get()
  @ApiOkResponse({ type: PagingDto })
  @UseGuards(AuthenticationGuard)
  async paging(@Query() query: PaginationQueryDto): Promise<PagingDto> {
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
