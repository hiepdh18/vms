import { Injectable, Logger } from '@nestjs/common';
import { Subscription, concatMap, interval } from 'rxjs';
// import { makePtzMoveObj } from './utils';

const STATUS = {
  OK: 'ok',
  ERROR: 'error',
};

const EVENT = {
  PTZ_HOME: 'ptzHome',
  PTZ_STOP: 'ptzStop',
  PTZ_MOVE: 'ptzMove',
  PTZ_CHECK: 'ptzCheck',
};

@Injectable()
export class PtzService {
  private readonly logger = new Logger(PtzService.name);

  // constructor(
  //   private readonly devicesService: DevicesService
  // ) { }
  // private async initPtzDevice(id: number) {
  //   if (this.ptzDevices.has(id)) return this.ptzDevices.get(id);
  //   if (!id) return { status: 'error', message: 'params.error.noParam:id' };

  //   const device = await this.devicesService.findOne(id);
  //   if (!device) {
  //     return { status: 'error', message: 'device.error.notFound' };
  //   }

  //   const onvifDevice: any = await this.onvifService.connect(device);
  //   if (!onvifDevice.current_profile) {
  //     onvifDevice.current_profile = device['profiles'].find(
  //       (profile) => profile.isDefault === true
  //     );
  //     if (!onvifDevice.current_profile)
  //       return { status: 'error', message: 'onvif.error.noDefaultProfile' };
  //   }

  //   if (!onvifDevice.services['ptz']) {
  //     return { status: 'error', message: 'ptz.error.noService' };
  //   }

  //   this.ptzDevices.set(id, onvifDevice);

  //   setTimeout(() => {
  //     this.ptzDevices.delete(id);
  //   }, 1000 * 60 * 5);

  //   return onvifDevice;
  // }

  // async handlePtzCheck(id: number) {
  //   const ptzDevice = await this.initPtzDevice(id);
  //   if (ptzDevice.status === STATUS.ERROR) return ptzDevice;

  //   return { status: STATUS.OK, event: EVENT.PTZ_CHECK };
  // }

  // async handlePtzMove(ptzMoveDto: PtzMoveDto) {
  //   this.logger.log('Ptz move');
  //   if (ptzMoveDto.speed < 0 || ptzMoveDto.speed > 1) {
  //     return { status: STATUS.ERROR, message: 'ptz.error.badSpeed' };
  //   }
  //   const ptzObj = makePtzMoveObj(ptzMoveDto, 10);
  //   const ptzDevice = await this.initPtzDevice(ptzMoveDto.id);
  //   if (ptzDevice.status === STATUS.ERROR) return ptzDevice;
  //   await ptzDevice.ptzMove(ptzObj);
  //   this.devicesService.updatePtz(ptzMoveDto.id, {
  //     currentPresetId: null,
  //     changed: true,
  //   });
  //   return { status: STATUS.OK, event: EVENT.PTZ_MOVE };
  // }

  // async handlePtzStop(id: number) {
  //   this.logger.log('Ptz stop');
  //   const ptzDevice = await this.initPtzDevice(id);
  //   if (ptzDevice.status === STATUS.ERROR) return ptzDevice;
  //   await ptzDevice.ptzStop();
  //   return { status: STATUS.OK, event: EVENT.PTZ_STOP };
  // }

  // async handlePtzHome(id: number) {
  //   this.logger.log('Ptz home');
  //   const ptzDevice = await this.initPtzDevice(id);
  //   if (ptzDevice.status === STATUS.ERROR) return ptzDevice;
  //   await ptzDevice.services['ptz'].absoluteMove({
  //     ProfileToken: ptzDevice.current_profile.token,
  //     Position: HOME_POSITION,
  //     Speed: DEFAULT_SPEED,
  //   });
  //   this.devicesService.updatePtz(id, { currentPresetId: null, changed: true });
  //   return { status: STATUS.OK, event: EVENT.PTZ_HOME };
  // }
  subscriptions = new Map<
    WebSocket,
    { subscription: Subscription; thermalAi: any }
  >();

  subscribeTest(client: WebSocket, id: number) {
    if (this.subscriptions.has(client)) {
      this.unSubscribeTest(client);
    }

    const thermalAi = {};
    const subscription = interval(2000)
      .pipe(
        concatMap(async () => {
          const tempData = ['1', '2', '3', '4', '5'];
          return tempData;
        })
      )
      .subscribe((data: any) => client.send(JSON.stringify({ data })));
    this.subscriptions.set(client, { subscription, thermalAi });
  }
  async unSubscribeTest(client: WebSocket) {
    if (!this.subscriptions.has(client)) {
      return;
    }

    const subscription = this.subscriptions.get(client);
    subscription?.subscription.unsubscribe();
    this.subscriptions.delete(client);

    this.logger.log('unsubscribe: ' + this.subscriptions.size);
  }
}
