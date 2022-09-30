import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersRoomService } from './user_room.service';
import { UserEntity } from 'src/user/user.entity';
import { UsersRoomDto } from './dto/user_room.dto';
import { UsersRoomEntity } from './entity/user_room.entity';
import { RoomEntity } from 'src/room/entity/room.entity';

@Controller('user_room')
export class UsersRoomController {
  constructor(private readonly usersRoomService: UsersRoomService) {}

  /* Create a new user in a room */
  @Post()
  async create(@Body() newUsersRoomDto: UsersRoomDto): Promise<UsersRoomEntity> {
    return await this.usersRoomService.create(newUsersRoomDto);
  }

  /* Get all users registered in rooms */
  @Get()
  async findAll(): Promise<UsersRoomEntity[]> {
    return await this.usersRoomService.findAll();
  }

  /* Get one user in a room */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UsersRoomEntity> {
    return await this.usersRoomService.findOne(id);
  }

  /* Get all users in a room */
  @Get('/rooms/:room_id/users')
  async getAllUsersInRoom(@Param(':room_id') room_id: string): Promise<UserEntity[]> {
      return await this.usersRoomService.getAllUsersInRoom(room_id);
  }

  /* Get all rooms with an user */
  @Get('/users/:user_id/rooms')
  async getAllRoomsWithUser(@Param(':user_id') user_id: string): Promise<RoomEntity[]> {
    return await this.usersRoomService.getAllRoomsWithUser(user_id);
  }

    /* Remove an user from a room */
    /* at least room mod || me needed */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.usersRoomService.remove(id);
  }
}
