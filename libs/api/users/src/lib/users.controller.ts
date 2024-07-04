import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '@vms/api/auth';
import { AuthenticationGuard, PermissionsGuard } from '@vms/api/auth/guards';
import { PaginationQueryDto, PagingDto } from '@vms/shared/base';
import { EUserEvent } from '@vms/shared/enums';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private services: UsersService,
    private eventEmitter: EventEmitter2
  ) {}

  @ApiOperation({ summary: 'Get users pagination' })
  @Get()
  @ApiOkResponse({ type: PagingDto })
  @UseGuards(AuthenticationGuard)
  async paging(@Query() query: PaginationQueryDto): Promise<PagingDto> {
    this.logger.log(JSON.stringify(query));
    return await this.services.findPaging(query);
  }

  @Permissions({ manage_camera: 'R' })
  @Get('test')
  test() {
    this.logger.log('TEST');
    this.eventEmitter.emit(EUserEvent.USER_LOGIN, {
      userId: 1,
    });
    return 1;
  }

  @OnEvent(EUserEvent.USER_LOGIN)
  loginEventHandler(payload: any) {
    console.log('🚀 [CHECKING] payload =>', { payload });
  }
}
