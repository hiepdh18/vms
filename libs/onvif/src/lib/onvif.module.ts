import { Module } from '@nestjs/common';
import { OnvifController } from './onvif.controller';
import { OnvifService } from './onvif.service';

@Module({
  controllers: [OnvifController],
  providers: [OnvifService],
  exports: [OnvifService],
})
export class OnvifModule {}
