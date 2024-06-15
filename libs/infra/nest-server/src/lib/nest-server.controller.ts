import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Liveness } from './entities/liveness.entity';
import { Version } from './entities/version.entity';

@Controller('internal')
export class NestServerController {
  @Get('liveness')
  @ApiOkResponse({ type: Liveness })
  liveness(): Liveness {
    return { ok: true };
  }

  @Get('version')
  @ApiOkResponse({ type: Version })
  version(): Version {
    return { version: process.env['VERSION'] || 'N/A' };
  }
}
