import { Test } from '@nestjs/testing';
import { NestServerController } from './nest-server.controller';

describe('NestServerController', () => {
  let controller: NestServerController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [NestServerController],
    }).compile();

    controller = module.get(NestServerController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
