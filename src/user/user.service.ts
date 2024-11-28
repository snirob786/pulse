import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }
  async findById(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
