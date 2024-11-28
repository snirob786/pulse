import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/message.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('messages')
@UseGuards(AuthGuard) // Protect all endpoints with authentication
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // Endpoint to create a message
  @Post()
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: any,
  ) {
    const senderId = req.user.userId; // Get senderId from authenticated user
    return this.messageService.createMessage(createMessageDto, senderId);
  }

  // Endpoint to get all messages for a specific conversation
  @Get(':conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.messageService.getMessagesByConversation(conversationId);
  }
}
