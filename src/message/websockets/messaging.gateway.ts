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
import { MessageService } from '../message.service';
import { CreateMessageDto } from '../dto/message.dto';

@WebSocketGateway({ cors: true })
export class MessagingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MessagingGateway');

  constructor(private readonly messageService: MessageService) {}

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
  async handleMessage(
    client: Socket,
    payload: {
      conversationId: string;
      content: string;
      type?: string;
      senderId: number;
    },
  ) {
    try {
      const createMessageDto: CreateMessageDto = {
        conversationId: payload.conversationId,
        content: payload.content,
        type: payload.type,
      };

      const message = await this.messageService.createMessage(
        createMessageDto,
        payload.senderId,
      );

      this.server.to(payload.conversationId).emit('receive_message', message);
    } catch (error) {
      this.logger.error('Error sending message:', error);
      client.emit('error', {
        error: error.message || 'Message could not be sent.',
      });
    }
  }

  @SubscribeMessage('join_conversation')
  handleJoinRoom(client: Socket, payload: { conversationId: string }) {
    try {
      client.join(payload.conversationId);
      this.logger.log(
        `Client ${client.id} joined room: ${payload.conversationId}`,
      );
      client.emit('joined_conversation', {
        conversationId: payload.conversationId,
      });
    } catch (error) {
      this.logger.error('Error joining room:', error);
      client.emit('error', { error: 'Could not join the conversation.' });
    }
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveRoom(client: Socket, payload: { conversationId: string }) {
    try {
      client.leave(payload.conversationId);
      this.logger.log(
        `Client ${client.id} left room: ${payload.conversationId}`,
      );
      client.emit('left_conversation', {
        conversationId: payload.conversationId,
      });
    } catch (error) {
      this.logger.error('Error leaving room:', error);
      client.emit('error', { error: 'Could not leave the conversation.' });
    }
  }
}
