import { Module } from '@nestjs/common';
import { OnvifModule } from '@vms/onvif';
import { PtzGateway } from './ptz.gateway';
import { PtzService } from './ptz.service';

@Module({
  imports: [OnvifModule],
  providers: [PtzGateway, PtzService],
})
export class PtzModule {}
