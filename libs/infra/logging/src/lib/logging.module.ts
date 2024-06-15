import { LoggerService, Module } from '@nestjs/common';
import { WinstonLogger } from 'nest-winston';
import { logger } from './logging';
export type { Logger } from 'winston';


export const LOGGER_PROVIDER = 'Logger';

@Module({
  providers: [{ provide: LOGGER_PROVIDER, useValue: logger }],
  exports: [{ provide: LOGGER_PROVIDER, useValue: logger }],
})
export class LoggingModule {
  static createLogger(): LoggerService {
    return new WinstonLogger(logger);
  }
}
