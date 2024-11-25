import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { email: string; name: string }) {
    return await this.prisma.user.create({
      data,
    });
  }

  async getUsers() {
    console.log('this is called');
    return await this.prisma.user.findMany();
  }
}
