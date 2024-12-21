import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new message in a conversation.
   * @param createMessageDto The DTO containing message details.
   * @param senderId The ID of the sender.
   * @returns The created message.
   */
  async createMessage(createMessageDto: CreateMessageDto, senderId: number) {
    const { conversationId, content, type } = createMessageDto;

    // Validate conversation existence
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (!content || content.trim() === '') {
      throw new BadRequestException('Message content cannot be empty');
    }

    return this.prisma.message.create({
      data: {
        conversationId,
        content,
        type: type || 'TEXT', // Default to 'TEXT' if type is not provided
        senderId,
      },
    });
  }

  /**
   * Retrieve messages for a specific conversation.
   * @param conversationId The ID of the conversation.
   * @returns A list of messages in the conversation.
   */
  async getMessagesByConversation(conversationId: string) {
    // Validate conversation existence
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, name: true } }, // Include sender details
      },
    });

    if (messages.length === 0) {
      throw new NotFoundException('No messages found in this conversation');
    }

    return messages;
  }
}
