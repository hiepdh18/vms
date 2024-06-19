import { Injectable, Logger } from '@nestjs/common';
import { ConnectDeviceDto } from './dto/connect.dto';
import { startProbe } from './onvif';
import { OnvifDevice } from './module';

@Injectable()
export class OnvifService {
  private readonly logger = new Logger(OnvifService.name);
  async search() {
    this.logger.log('Start the discovery process.');
    try {
      const devices = await startProbe();
      this.logger.log(devices.length + ' devices were found.');

      devices.forEach((device) => {
        this.logger.log('  - ' + device.urn);
        this.logger.log('  - ' + device.name);
        this.logger.log('  - ' + device.xaddrs[0]);
      });
      return devices;
    } catch (error) {
      this.logger.error(error);
      return {};
    }
  }

  async connect(dto: ConnectDeviceDto) {
    const { host, port, username, password } = dto;
    const device = new OnvifDevice({
      xaddr: `http://${host}:${port}/onvif/device_service`,
      user: username,
      pass: password,
    });
    try {
      const deviceInfo = await device.init();
      this.logger.log(JSON.stringify(deviceInfo, null, '  '));
      return deviceInfo;
    } catch (error) {
      this.logger.error(error);
      return {
        success: false,
      };
    }
  }
}
