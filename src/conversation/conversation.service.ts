import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(participants: number[], firstMessage: string) {
    if (!participants || participants.length < 2) {
      throw new Error(
        'At least two participants are required to create a conversation.',
      );
    }

    // Validate the sender
    const senderId = participants[0];
    const senderExists = await this.prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!senderExists) {
      throw new Error('The sender does not exist.');
    }

    // Validate participants
    const validParticipants = await this.prisma.user.findMany({
      where: { id: { in: participants } },
    });

    if (validParticipants.length !== participants.length) {
      throw new Error('Some participants do not exist.');
    }

    // Create the conversation
    let result = await this.prisma.conversation.create({
      data: {
        participants: {
          connect: participants.map((id) => ({ id })),
        },
        messages: {
          create: {
            content: firstMessage,
            senderId,
          },
        },
      },
      include: {
        messages: true,
      },
    });
    console.log(
      '🚀 ~ ConversationService ~ createConversation ~ result:',
      result,
    );
    return result;
  }

  async getConversations(userId: number) {
    return await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async sendMessage(conversationId: string, senderId: number, content: string) {
    return await this.prisma.message.create({
      data: {
        content,
        senderId,
        conversationId,
      },
    });
  }
}
