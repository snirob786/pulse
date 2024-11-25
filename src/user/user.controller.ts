import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: { email: string; name: string }) {
    return await this.userService.createUser(body);
  }

  @Get()
  async findAll() {
    return await this.userService.getUsers();
  }
}
