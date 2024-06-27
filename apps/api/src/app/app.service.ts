import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(@InjectRedis() private readonly redis: Redis) {

  }
  async getData() {
    this.logger.log('For testing');
    this.redis.publish('controlSignal', JSON.stringify({ name: 'test' }));
    return { message: 'Hello API' };
  }
}
