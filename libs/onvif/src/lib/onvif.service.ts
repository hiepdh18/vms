import { Injectable, Logger } from '@nestjs/common';
import { ConnectDeviceDto } from './dto/connect.dto';
import { startProbe } from './onvif';
import { OnvifDevice } from './module';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import * as fs from 'fs-extra';

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

  async connect(dto: ConnectDeviceDto): Promise<OnvifDevice | any> {
    const { host, port, username, password } = dto;
    const device = new OnvifDevice({
      xaddr: `http://${host}:${port}/onvif/device_service`,
      user: username,
      pass: password,
    });
    try {
      const deviceInfo = await device.init();
      this.logger.log(JSON.stringify(deviceInfo, null, '  '));
      return device;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async snapshot(dto: ConnectDeviceDto) {
    this.logger.log(JSON.stringify(dto));
    try {
      const device: OnvifDevice = await this.connect(dto);
      // const { host, port, username, password } = dto;
      // const device = new OnvifDevice({
      //   xaddr: `http://${host}:${port}/onvif/device_service`,
      //   user: username,
      //   pass: password,
      // });
      if (!device) return;
      const snap = await device.fetchSnapshot();
      // const snap = await device.fetchSnapshotByUrl(
      //   'http://192.168.6.125/onvifsnapshot/media_service/snapshot?channel=1&subtype=0'
      // );
      // const buffer = result.body;
      // const contentType = _.get(result, 'headers.content-type', 'image/jpeg');

      const fullPath = path.join(
        process.env['STATIC_PATH'] || 'apps/api/public',
        'images'
      );

      const fileName = `${uuidv4()}.jpg`;
      // const fileName = `${nanoid(12)}.jpg`;
      const filePath = path.join(fullPath, fileName);
      if (!fs.existsSync(fullPath))
        [fs.mkdirSync(fullPath, { recursive: true })];
      fs.writeFileSync(filePath, snap.body, { encoding: 'binary' });

      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        data: 'undefined',
      };
    }
  }
}
