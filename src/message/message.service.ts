import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(createMessageDto: CreateMessageDto, senderId: number) {
    const { conversationId, content, type } = createMessageDto;

    return this.prisma.message.create({
      data: {
        conversationId,
        content,
        type: type || 'TEXT',
        senderId,
      },
    });
  }

  async getMessagesByConversation(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, name: true } }, // Include sender details
      },
    });
  }
}
