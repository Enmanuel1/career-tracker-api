import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    return this.usersService.update(id, userData);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: `User with id ${id} has been deleted` };
  }
}
