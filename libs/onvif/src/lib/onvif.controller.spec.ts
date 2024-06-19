import { Test } from '@nestjs/testing';
import { OnvifController } from './onvif.controller';
import { OnvifService } from './onvif.service';

describe('OnvifController', () => {
  let controller: OnvifController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OnvifService],
      controllers: [OnvifController],
    }).compile();

    controller = module.get(OnvifController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
