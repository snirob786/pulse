import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use env for production
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ], // Ensure required modules are imported
  providers: [AuthService, PrismaService, AuthStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Export AuthService for use in other modules if needed
})
export class AuthModule {}
