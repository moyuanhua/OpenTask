import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { EventType } from '../common/enums/event-type.enum';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws',
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  afterInit() {
    this.logger.log('WebSocket gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe:task')
  handleSubscribeTask(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `task:${data.taskId}`;
    client.join(room);
    client.emit('subscribed', { room });
    this.logger.log(`Client ${client.id} subscribed to ${room}`);
  }

  @SubscribeMessage('unsubscribe:task')
  handleUnsubscribeTask(
    @MessageBody() data: { taskId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `task:${data.taskId}`;
    client.leave(room);
    client.emit('unsubscribed', { room });
  }

  @SubscribeMessage('subscribe:all')
  handleSubscribeAll(@ConnectedSocket() client: Socket) {
    client.join('global');
    client.emit('subscribed', { room: 'global' });
  }

  @OnEvent('**')
  handleAnyEvent(payload: Record<string, unknown> & { type: string; taskId?: string }) {
    this.server?.emit('event', payload);

    if (payload.taskId) {
      this.server?.to(`task:${payload.taskId}`).emit('event', payload);
    }
  }
}
