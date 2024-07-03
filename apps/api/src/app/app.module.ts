import { RedisModule } from '@nestjs-modules/ioredis';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from '@vms/api/auth';
import { UsersModule } from '@vms/api/users';
import { PtzModule } from '@vms/api/ws/ptz';
import { GetPermissionsMiddleware } from '@vms/middlewares';
import { OnvifModule } from '@vms/onvif';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './exception.filter';

@Module({
  imports: [
    RedisModule.forRoot({
      url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`,
      type: 'single',
    }),
    OnvifModule,
    PtzModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GetPermissionsMiddleware).forRoutes('*');
  }
}
