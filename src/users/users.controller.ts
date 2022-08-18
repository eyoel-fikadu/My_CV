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
import {
  SerializeIntereceptor,
  Serialize,
} from 'src/intereceptors/serialize.intereceptor';
import { UserDto } from './dtos/user.dto';

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

  // @UseInterceptors(new SerializeIntereceptor(UserDto))
  @Serialize(UserDto)
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
