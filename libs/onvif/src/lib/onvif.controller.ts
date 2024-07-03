import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConnectDeviceDto, ConnectDeviceOkDto } from './dto/connect.dto';
import { OnvifService } from './onvif.service';
import { ProbeDeviceOkDto } from './dto/probe.dto';

@ApiTags('onvif')
@Controller('onvif')
export class OnvifController {
  constructor(private onvifService: OnvifService) { }

  @ApiOperation({ summary: 'Search for ONVIF devices' })
  @ApiOkResponse({ type: [ProbeDeviceOkDto] })
  @Get('search')
  async search() {
    return this.onvifService.search();
  }

  @ApiOperation({ summary: 'Connect to ONVIF device' })
  @ApiOkResponse({ type: ConnectDeviceOkDto })
  @Post('connect')
  async connect(@Body() connectDeviceDto: ConnectDeviceDto) {
    return this.onvifService.connect(connectDeviceDto);
  }
}
