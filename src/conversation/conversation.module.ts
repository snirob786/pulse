import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, PrismaService],
})
export class ConversationModule {}
