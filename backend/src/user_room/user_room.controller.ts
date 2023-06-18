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
    ForbiddenException,
    BadRequestException,
    UseGuards } from '@nestjs/common';
import { UserRoomService } from './user_room.service';
import { CreateUserRoomDto } from './dto/user_room.dto';
import { UserRoomEntity } from './entity/user_room.entity';
import { RoomEntity } from '../room/entity/room.entity';
import { UserService } from '../user/services/user.service';
import { RoomService } from '../room/room.service';
import { UserRoomQueryDto } from './dto/user_room.query.dto';
import { IsPrivate } from '../common/guards/is-private.guard';
import { Banned } from './guards/banned.guard';
import { UserCreds } from 'src/common/decorators/user-cred.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { RoomRolesService } from 'src/room_roles/room_roles.service';
import { ForbiddenWsException } from 'src/game/exceptions/forbidden.wsException';
import { UserCredsDto } from 'src/common/dtos/user.creds.dto';

@Controller('user_room')
export class UserRoomController {
    constructor (
        private readonly userRoomService: UserRoomService,
        private readonly roomRolesService: RoomRolesService,
        private readonly userService: UserService,
        private readonly roomService: RoomService,
    ) {
            this.userRoomLogger = new Logger(UserRoomController.name);
    }
    private readonly userRoomLogger: Logger;

    /* Get all users registered in rooms */
    @Get()
    public async findAll(@Query() queryParams?: UserRoomQueryDto): Promise<UserRoomEntity[]> {
        return await this.userRoomService.findAll(queryParams);
    }

    /* Get one user in a room */
    @Get(':id')
    public async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserRoomEntity> {
        const userRoom: UserRoomEntity = await this.userRoomService.findOne(id);
        if (userRoom === null) {
            this.userRoomLogger.error(`No user room relation with id ${id} found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return userRoom;
    }

    /* Get all users in a room */
    @Get('/rooms/:room_id/users')
    public async getAllUsersInRoom(@Param('room_id', ParseIntPipe) roomId: number): Promise<UserRoomEntity[]> {
        if (await this.roomService.findOne(roomId) === null) {
            this.userRoomLogger.error(`No room with id ${roomId} found in database`);
            throw new NotFoundException('resource not found in database');
        }
//        return await this.userRoomService.getAllUsersInRoom(roomId);
        return await this.userRoomService.findByRoomId(roomId);
    }

    /* Get all rooms with a user */
    @Get('/users/:user_id/rooms')
    public async getAllRoomsWithUser(@Param('user_id', ParseIntPipe) userId: number): Promise<RoomEntity[]> {
        if (await this.userService.findOne(userId) === null) {
            this.userRoomLogger.error(`No user with id ${userId} found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userRoomService.getAllRoomsWithUser(userId);
    }

    /* Get user in room by user and room id */
    @Get('/users/:user_id/rooms/:room_id')
    public async getUserRoomById(
        @Param('user_id', ParseIntPipe) userId: number,
        @Param('room_id', ParseIntPipe) roomId: number
    ): Promise<UserRoomEntity> {
        if (await this.userService.findOne(userId) === null ||
            await this.roomService.findOne(roomId) === null) {
                this.userRoomLogger.error(`Resource not found in database`);
                throw new NotFoundException('resource not found in database');
            }
        return await this.userRoomService.findUserRoomIds(userId, roomId);
    }

    @Get('/me/rooms')
    public async getAllRoomsWithMe (@UserCreds() userCreds: UserCredsDto): Promise<RoomEntity[]> {
        const { username, id } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);
        
        if (user === null) {
            this.userRoomLogger.error(`User with login ${username} not present in database`);
            throw new NotFoundException('resource not found in database');
        }
        if (await this.userService.findOne(id) === null) {
            this.userRoomLogger.error(`No user with id ${id} found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userRoomService.getAllRoomsWithUser(id);
    }

    /* Create a new user in a room */
    //@UseGuarhds(Banned)
    //@UseGuards(IsPrivate) /*???*/
    //@UseGuards(userisme)
    @Post()
    public async create(
        @Body() dto: CreateUserRoomDto,
        @UserCreds() userCreds: UserCredsDto
    ): Promise<UserRoomEntity> {
        const { roomId } = dto;
        const { id: userId } = userCreds;

        if (await this.userService.findOne(userId) === null ||
            await this.roomService.findOne(roomId) === null) {
            this.userRoomLogger.error('Invalid creation payload received from request (no user or room present in database)');
            throw new BadRequestException('resource not found in database')
        }
        if (await this.userRoomService.findUserRoomIds(userId, roomId) !== null) {
            this.userRoomLogger.error(`User ${userId} already registered in room ${roomId}`);
            throw new BadRequestException('resource already in database');
        }
        if ((await this.roomRolesService.isRole('private', roomId)) === true &&
             await this.userRoomService.validateUserPassword(dto) === false) {
                this.userRoomLogger.error(`User with id ${userId} introduced wrong credentials`);
                throw new ForbiddenException('invalid credentials');
        }
        return await this.userRoomService.create({ userId: userId, roomId: roomId });
    }

    /* Remove an user from a room */
    /* at least room mod || me needed */
    @Delete(':id')
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        const userRoom: UserRoomEntity = await this.userRoomService.findOne(id);

        if (userRoom === null) {
            this.userRoomLogger.error(`Resource with id ${id} not found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userRoomService.remove(userRoom);
    }
}
