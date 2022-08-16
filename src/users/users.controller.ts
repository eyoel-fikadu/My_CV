import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-users.dto';

@Controller('auth')
export class UsersController {
  @Post('signup')
  createUser(@Body() user: CreateUserDto) {
    console.log(user);
  }
}
