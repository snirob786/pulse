import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(
    @Body('participants') participants: number[],
    @Body('firstMessage') firstMessage: string,
  ) {
    return this.conversationService.createConversation(
      participants,
      firstMessage,
    );
  }

  @Get(':userId')
  async getConversations(@Param('userId') userId: number) {
    userId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    return this.conversationService.getConversations(userId);
  }

  @Post(':conversationId/messages')
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Body('senderId') senderId: number,
    @Body('content') content: string,
  ) {
    return this.conversationService.sendMessage(
      conversationId,
      senderId,
      content,
    );
  }
}
