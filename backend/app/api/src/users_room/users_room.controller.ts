import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersRoomService } from './users_room.service';
import { UserEntity } from 'src/user/user.entity';
import { UsersRoomDto } from './dto/users_room.dto';
import { UsersRoomEntity } from './entities/users_room.entity';
import { RoomEntity } from 'src/room/entities/room.entity';

@Controller('users-room')
export class UsersRoomController {
  constructor(private readonly usersRoomService: UsersRoomService) {}

  @Post()
  async create(@Body() newUsersRoomDto: UsersRoomDto): Promise<UsersRoomEntity> {
    return await this.usersRoomService.create(newUsersRoomDto);
  }

  @Get()
  async findAll(): Promise<UsersRoomEntity[]> {
    return await this.usersRoomService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UsersRoomEntity> {
    return await this.usersRoomService.findOne(id);
  }

  @Get('/rooms/:room_id')
  async getAllUsersInRoom(@Param(':room_id') room_id: string): Promise<UserEntity[]> {
      return await this.usersRoomService.getAllUsersInRoom(room_id);
  }

  @Get('/users/:user_id')
  async getAllRoomsWithUser(@Param(':user_id') user_id: string): Promise<RoomEntity[]> {
    return await this.usersRoomService.getAllRoomsWithUser(user_id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersRoomService.remove(+id);
  }
}
