import { Test } from '@nestjs/testing';
import { OnvifService } from './onvif.service';

describe('OnvifService', () => {
  let service: OnvifService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OnvifService],
    }).compile();

    service = module.get(OnvifService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
