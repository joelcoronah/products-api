import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { data: { user }, statusCode: 'USER_CREATED', message: 'User created successfully' };
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() { page, offset, limit, firstName }) {
    const data = await this.usersService.findAll({ page, offset, limit, firstName });
    return { data, statusCode: 'USER_LISTED', message: 'User listed successfully' };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(+id);
    return { data, statusCode: 'USER_LISTED', message: 'User listed successfully' };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(+id, updateUserDto);
    return { data, statusCode: 'USER_UPDATED', message: 'User updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.usersService.remove(+id);
    return { data, statusCode: 'USER_DELETED', message: 'User deleted successfully' };
  }
}
