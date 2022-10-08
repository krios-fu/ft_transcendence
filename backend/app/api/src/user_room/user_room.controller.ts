import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserRoomService } from './user_room.service';
import { UserEntity } from 'src/user/user.entity';
import { CreateUserRoomDto } from './dto/user_room.dto';
import { UserRoomEntity } from './entity/user_room.entity';
import { RoomEntity } from 'src/room/entity/room.entity';

@Controller('user_room')
export class UserRoomController {
    constructor(private readonly userRoomService: UserRoomService) {}

    /* Get all users registered in rooms */
    @Get()
    public async findAll(): Promise<UserRoomEntity[]> {
        return await this.userRoomService.findAll();
    }

    /* Get one user in a room */
    @Get(':id')
    public async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserRoomEntity> {
        return await this.userRoomService.findOne(id);
    }

    /* Get all users in a room */
    @Get('/rooms/:room_id/users')
    public async getAllUsersInRoom(@Param(':room_id') room_id: string): Promise<UserEntity[]> {
        return await this.userRoomService.getAllUsersInRoom(room_id);
    }

    /* Get all rooms with an user */
    @Get('/users/:user_id/rooms')
    public async getAllRoomsWithUser(@Param(':user_id') user_id: string): Promise<RoomEntity[]> {
        return await this.userRoomService.getAllRoomsWithUser(user_id);
    }
    /* Create a new user in a room */
    @Post()
    public async create(@Body() newDto: CreateUserRoomDto): Promise<UserRoomEntity> {
        return await this.userRoomService.create(newDto);
    }

        /* Remove an user from a room */
        /* at least room mod || me needed */
    @Delete(':id')
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.userRoomService.remove(id);
    }
}
