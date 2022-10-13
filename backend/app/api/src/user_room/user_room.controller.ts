import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Query, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UserRoomService } from './user_room.service';
import { UserEntity } from 'src/user/user.entity';
import { CreateUserRoomDto } from './dto/user_room.dto';
import { UserRoomEntity } from './entity/user_room.entity';
import { RoomEntity } from 'src/room/entity/room.entity';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';
import { UserRoomQueryDto } from './dto/user_room.query.dto';

@Controller('user_room')
export class UserRoomController {
    constructor (
        private readonly userRoomService: UserRoomService,
        private readonly userService: UserService,
        private readonly roomService: RoomService,
    ) {
            this.userRoomLogger = new Logger(UserRoomController.name);
    }
    private readonly userRoomLogger: Logger;

    /* Get all users registered in rooms */
    @Get()
    public async findAll(@Query() queryParams: UserRoomQueryDto): Promise<UserRoomEntity[]> {
        return await this.userRoomService.findAll(queryParams);
    }

    /* Get one user in a room */
    @Get(':id')
    public async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserRoomEntity> {
        const userRoom = await this.userRoomService.findOne(id);
        if (userRoom === null) {
            this.userRoomLogger.error('No user room relation with id ' + id + ' found in database');
            throw new HttpException('no user role in db', HttpStatus.NOT_FOUND);
        }
        return userRoom;
    }

    /* Get all users in a room */
    @Get('/rooms/:room_id/users')
    public async getAllUsersInRoom(@Param(':room_id', ParseIntPipe) roomId: number): Promise<UserEntity[]> {
        if (await this.roomService.findOne(roomId) === null) {
            this.userRoomLogger.error('No room with id ' + roomId + ' found in database');
            throw new HttpException('no room in db', HttpStatus.NOT_FOUND);
        }
        return await this.userRoomService.getAllUsersInRoom(roomId);
    }

    /* Get all rooms with an user */
    @Get('/users/:user_id/rooms')
    public async getAllRoomsWithUser(@Param(':user_id', ParseIntPipe) userId: number): Promise<RoomEntity[]> {
        if (await this.userService.findOne(userId) === null) {
            this.userRoomLogger.error('No user with id ' + userId + ' found in database');
            throw new HttpException('no user in db', HttpStatus.NOT_FOUND);
        }
        return await this.userRoomService.getAllRoomsWithUser(userId);
    }

    /* Create a new user in a room */
    @Post()
    public async create(@Body() dto: CreateUserRoomDto): Promise<UserRoomEntity> {
        const { userId, roomId } = dto;
        if (await this.userRoomService.findUserRoomIds(userId, roomId) !== null) {
            this.userRoomLogger.error('User ' + userId + ' already present in room ' + roomId + ' in database');
            throw new HttpException('user room already in db', HttpStatus.BAD_REQUEST);
        }
        return await this.userRoomService.create(dto);
    }

    /* Remove an user from a room */
    /* at least room mod || me needed */
    @Delete(':id')
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.userRoomService.remove(id);
    }
}
