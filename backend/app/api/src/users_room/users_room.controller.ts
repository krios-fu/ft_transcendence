import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersRoomService } from './users_room.service';
import { CreateUsersRoomDto } from './dto/create-users_room.dto';
import { UpdateUsersRoomDto } from './dto/update-users_room.dto';

@Controller('users-room')
export class UsersRoomController {
  constructor(private readonly usersRoomService: UsersRoomService) {}

  @Post()
  create(@Body() createUsersRoomDto: CreateUsersRoomDto) {
    return this.usersRoomService.create(createUsersRoomDto);
  }

  @Get()
  findAll() {
    return this.usersRoomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersRoomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersRoomDto: UpdateUsersRoomDto) {
    return this.usersRoomService.update(+id, updateUsersRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersRoomService.remove(+id);
  }
}
