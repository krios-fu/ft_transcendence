import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    ParseIntPipe,
    Query,
    Logger,
    NotFoundException,
    BadRequestException,
    UseGuards } from '@nestjs/common';
import { UserRoomService } from './user_room.service';
import { CreateUserRoomDto } from './dto/user_room.dto';
import { UserRoomEntity } from './entity/user_room.entity';
import { RoomEntity } from 'src/room/entity/room.entity';
import { UserService } from 'src/user/services/user.service';
import { RoomService } from 'src/room/room.service';
import { UserRoomQueryDto } from './dto/user_room.query.dto';
import { IsPrivate } from 'src/common/guards/is-private.guard';
import { Banned } from './guards/banned.guard';
import { UserCreds } from 'src/common/decorators/user-cred.decorator';

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
        const userRoom: UserRoomEntity = await this.userRoomService.findOne(id);
        if (userRoom === null) {
            this.userRoomLogger.error(`No user room relation with id ${id} found in database`);
            throw new NotFoundException('resource not found');
        }
        return userRoom;
    }

    /* Get all users in a room */
    @Get('/rooms/:room_id/users')
    public async getAllUsersInRoom(@Param('room_id', ParseIntPipe) roomId: number): Promise<UserRoomEntity[]> {
        if (await this.roomService.findOne(roomId) === null) {
            this.userRoomLogger.error(`No room with id ${roomId} found in database`);
            throw new NotFoundException('resource not found');
        }
        return await this.userRoomService.getAllUsersInRoom(roomId);
    }

    /* Get all rooms with a user */
    @Get('/users/:user_id/rooms')
    public async getAllRoomsWithUser(@Param('user_id', ParseIntPipe) userId: number): Promise<RoomEntity[]> {
        if (await this.userService.findOne(userId) === null) {
            this.userRoomLogger.error(`No user with id ${userId} found in database`);
            throw new NotFoundException('resource not found');
        }
        return await this.userRoomService.getAllRoomsWithUser(userId);
    }

    /* Get user in room by user and room id */
    @Get('/users/:user_id/rooms/:room_id')
    public async getUserRoomById(
        @Param('user_id', ParseIntPipe) userId: number,
        @Param('room_id', ParseIntPipe) roomId: number
    ): Promise<UserRoomEntity> {
        if (await this.userService.findOne(userId) ||
            await this.roomService.findOne(roomId)) {
                this.userRoomLogger.error(`Resource not found in database`);
                throw new NotFoundException('resource not found');
            }
        return await this.userRoomService.findUserRoomIds(userId, roomId);
    }

    @Get('/me/rooms')
    public async getAllRoomsWithMe (@UserCreds() username: string): Promise<RoomEntity[]> {
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userRoomLogger.error(`User with login ${username} not present in database`);
            throw new NotFoundException('resource not found in database');
        }
        if (await this.userService.findOne(user.id) === null) {
            this.userRoomLogger.error('No user with id ' + user.id+ ' found in database');
            throw new NotFoundException('resource not found in database');
        }
        return await this.userRoomService.getAllRoomsWithUser(user.id);
    }

    /* Create a new user in a room */
    //@UseGuards(Banned)
    //@UseGuards(IsPrivate)
    @Post()
    public async create(@Body() dto: CreateUserRoomDto): Promise<UserRoomEntity> {
        const { userId, roomId } = dto;

        if (await this.userRoomService.findUserRoomIds(userId, roomId) !== null) {
            this.userRoomLogger.error(`User ${userId} already registered in room ${roomId}`);
            throw new BadRequestException('resource already in database');
        }
        return await this.userRoomService.create(dto);
    }

    /* Remove an user from a room */
    /* at least room mod || me needed */
    @Delete(':id')
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        const userRoom: UserRoomEntity = await this.userRoomService.findOne(id);

        if (userRoom === null) {
            this.userRoomLogger.error(`Entity ${id} not found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userRoomService.remove(userRoom);
    }
}
