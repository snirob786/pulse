import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    let res = await this.userService.getUsers();
    return {
      statusCode: 200,
      success: true,
      message: 'User list retrieved succesfully',
      data: res,
    };
  }
}
