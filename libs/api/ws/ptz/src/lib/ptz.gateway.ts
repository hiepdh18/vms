import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { PtzService } from './ptz.service';

const EVENT = {
  PTZ_HOME: 'ptzHome',
  PTZ_STOP: 'ptzStop',
  PTZ_MOVE: 'ptzMove',
  PTZ_CHECK: 'ptzCheck',
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/ptz',
})
export class PtzGateway {
  constructor(private readonly service: PtzService) {}

  // @SubscribeMessage(EVENT.PTZ_CHECK)
  // async ptzCheck(@MessageBody() { id }: { id: number }) {
  //   return this.service.handlePtzCheck(id);
  // }

  // @SubscribeMessage(EVENT.PTZ_MOVE)
  // async ptzMove(@MessageBody() ptzMoveDto: PtzMoveDto) {
  //   return this.service.handlePtzMove(ptzMoveDto);
  // }

  // @SubscribeMessage(EVENT.PTZ_STOP)
  // async ptzStop(@MessageBody() { id }: { id: number }) {
  //   return this.service.handlePtzStop(id);
  // }

  // @SubscribeMessage(EVENT.PTZ_HOME)
  // async ptzHome(@MessageBody() { id }: { id: number }) {
  //   return this.service.handlePtzHome(id);
  // }

  @SubscribeMessage('subscribe.test')
  async subscribeTest(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() { id }: { id: number }
  ) {
    return this.service.subscribeTest(client, id);
  }
  @SubscribeMessage('unSubscribe.test')
  async unSubscribeTest(
    @ConnectedSocket() client: WebSocket,
  ) {
    this.service.unSubscribeTest(client);
    return {
      status: 1,
      message: 'unsubscribe test',
    };
  }
}
