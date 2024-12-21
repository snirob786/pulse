import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/message.dto';
import { AuthGuard } from 'src/auth/auth.guard';

interface AuthenticatedRequest extends Request {
  user: { sub: number; role?: string };
}

@Controller('messages')
@UseGuards(AuthGuard) // Protect all endpoints with authentication
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // Endpoint to create a message
  @Post()
  @UsePipes(new ValidationPipe()) // Enforce DTO validation
  async createMessage(
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const senderId = req.user.sub; // Get senderId from authenticated user
      return await this.messageService.createMessage(
        createMessageDto,
        senderId,
      );
    } catch (error) {
      throw new NotFoundException('Failed to create message'); // Replace with relevant exception
    }
  }

  // Endpoint to get all messages for a specific conversation
  @Get(':conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    try {
      const messages =
        await this.messageService.getMessagesByConversation(conversationId);
      if (!messages || messages.length === 0) {
        throw new NotFoundException('No messages found for this conversation');
      }
      return messages;
    } catch (error) {
      throw new NotFoundException('Failed to retrieve messages'); // Replace with relevant exception
    }
  }
}
