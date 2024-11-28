import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MessagingGateway } from './websockets/messaging.gateway';

@Module({
  imports: [JwtModule],
  controllers: [MessageController],
  providers: [MessageService, PrismaService, UserService, MessagingGateway],
  exports: [MessageService],
})
export class MessageModule {}
