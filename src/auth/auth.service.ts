import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    });

    return {
      message: 'User registered successfully',
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new BadRequestException('Invalid credentials.');
    }

    // Generate JWT payload
    const payload = { name: user.name, email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successful', access_token: token };
  }
}
