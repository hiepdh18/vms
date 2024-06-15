import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  getData(): { message: string } {
    this.logger.error({ name: 'hiep', age: 14, country: 'VI' });
    console.log('TEST')
    return { message: 'Hello API' };
  }
}
