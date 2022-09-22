import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersRoomService } from './users_room.service';
import { UserEntity } from 'src/user/user.entity';
import { UsersRoomDto } from './dto/users_room.dto';
import { UsersRoomEntity } from './entities/users_room.entity';

@Controller('users-room')
export class UsersRoomController {
  constructor(private readonly usersRoomService: UsersRoomService) {}

  @Post()
  async create(@Body() newUsersRoomDto: UsersRoomDto): Promise<UsersRoomEntity> {
    return this.usersRoomService.create(newUsersRoomDto);
  }

  @Get()
  async findAll(): Promise<UsersRoomEntity[]> {
    return this.usersRoomService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UsersRoomEntity> {
    return this.usersRoomService.findOne(+id);
  }

  @Get('/rooms/:room_id')
  async getAllUsersInRoom(@Param(':room_id') room_id: string): Promise<UserEntity[]> {
      return this.usersRoomService.getAllUsersInRoom(room_id);
  }

  @Get('/users/:user_id')
  async getAllRoomsWithUser(@Param(':user_id') user_id: string): Promise<RoomEntity[]> {
    return this.usersRoomService.getAllRoomsWithUser(user_id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUsersRoomDto: UpdateUsersRoomDto) {
    return this.usersRoomService.update(+id, updateUsersRoomDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersRoomService.remove(+id);
  }
}
