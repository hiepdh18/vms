import { DynamicModule, Module, Type } from '@nestjs/common';
import { NestServerController } from './nest-server.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApPInterceptor } from './app.interceptor';

interface ModuleOptions {
  appModule: Type<any>;
}

@Module({
  controllers: [NestServerController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass : ApPInterceptor
    }
  ],
  exports: [],
})
export class NestServerModule {
  static forRoot({ appModule }: ModuleOptions): DynamicModule {
    const imports = [appModule];
    return {
      module: NestServerModule,
      imports,
    };
  }
}
