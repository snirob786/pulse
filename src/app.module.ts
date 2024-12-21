import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './common/transform.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionService } from './common/encryption.service';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConversationModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    EncryptionService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
