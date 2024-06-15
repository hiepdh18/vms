import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  getData(): { message: string } {
    this.logger.log('For testing')
    this.logger.log('TRY')
    // throw new Error()
    try {
      throw new BadRequestException({ code: 105, message: 'loi roi' });
    } catch (error) {
      console.log('test');

    }

    throw new BadRequestException({ code: 106, message: 'loi nua roi' });
    return { message: 'Hello API' };
  }
}
