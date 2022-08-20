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
  Session,
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
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('signup')
  async createUser(@Body() user: CreateUserDto, @Session() session: any) {
    const data = await this.userService.signup(user.email, user.password);
    session.userId = data.id;
    return data;
  }

  @Post('signIn')
  async signin(@Body() user: CreateUserDto, @Session() session: any) {
    const data = await this.userService.sign(user.email, user.password);
    session.userId = data.id;
    return data;
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() user: UpdateUserDto) {
    return this.userService.update(id, user);
  }

  // @UseInterceptors(new SerializeIntereceptor(UserDto))
  // @Serialize(UserDto)
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
