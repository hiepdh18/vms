import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { OnvifModule } from '@vms/onvif';
import { PtzModule } from '@vms/ws-ptz';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './exception.filter';

@Module({
  imports: [OnvifModule, PtzModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
