import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class MessagingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MessagingGateway');

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, payload: any) {
    // Broadcast the message to the conversation participants
    this.server.to(payload.conversationId).emit('receive_message', payload);
  }

  // Join a specific conversation room
  @SubscribeMessage('join_conversation')
  handleJoinRoom(client: Socket, conversationId: string) {
    client.join(conversationId);
    this.logger.log(`Client ${client.id} joined room: ${conversationId}`);
  }
}
