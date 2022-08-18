import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-users.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeIntereceptor } from 'src/intereceptors/serialize.intereceptor';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('signup')
  createUser(@Body() user: CreateUserDto) {
    this.userService.create(user.email, user.password);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() user: UpdateUserDto) {
    return this.userService.update(id, user);
  }

  @UseInterceptors(SerializeIntereceptor)
  @Get('/:id')
  findUser(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
