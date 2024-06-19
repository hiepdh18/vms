import { Body, Controller, Get, Post } from '@nestjs/common';
import { OnvifService } from './onvif.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ConnectDeviceDto } from './dto/connect.dto';

@Controller('onvif')
export class OnvifController {
  constructor(private onvifService: OnvifService) {}

  @Get()
  health() {
    return { success: true };
  }

  @ApiOperation({ summary: 'Search for ONVIF devices' })
  // @ApiOkResponse({ type: [ProbeDeviceOkDto] })
  @Get('search')
  async search() {
    return this.onvifService.search();
  }

  @ApiOperation({ summary: 'Connect to ONVIF device' })
  // @ApiOkResponse({ type: ConnectDeviceOkDto })
  @Post('connect')
  async connect(@Body() connectDeviceDto: ConnectDeviceDto) {
    return this.onvifService.connect(connectDeviceDto);
  }
}
