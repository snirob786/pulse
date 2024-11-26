import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule], // Ensure required modules are imported
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService], // Export AuthService for use in other modules if needed
})
export class AuthModule {}
