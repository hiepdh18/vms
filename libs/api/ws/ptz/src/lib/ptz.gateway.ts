import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { PtzService } from './ptz.service';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

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
export class PtzGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(PtzGateway.name);
  private subscriber;
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly service: PtzService
  ) {
    this.subscriber = this.redis.duplicate();
  }
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    this.subscriber.subscribe('controlSignal', (err, count) => {
      if (err) {
        this.logger.error('Failed to subscribe: %s', err.message);
      } else {
        this.logger.log(
          `Subscribed successfully! This client is currently subscribed to ${count} channels.`
        );
      }
    });
    this.subscriber.on('message', (event, message) => {
      if (event === 'controlSignal') {
        this.logger.log(message);
        client.send(message);
      }
    });
  }
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }

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

  // @SubscribeMessage('subscribe.test')
  // async subscribeTest(
  //   @ConnectedSocket() client: WebSocket,
  //   @MessageBody() { id }: { id: number }
  // ) {
  //   return this.service.subscribeTest(client, id);
  // }
  // @SubscribeMessage('unSubscribe.test')
  // async unSubscribeTest(@ConnectedSocket() client: WebSocket) {
  //   this.service.unSubscribeTest(client);
  //   return {
  //     status: 1,
  //     message: 'unsubscribe test',
  //   };
  // }
}
