import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { RoomEntity } from '../room/entity/room.entity';
import { RoomService } from '../room/room.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { BanService } from './ban.service';
import { CreateBanDto } from './dto/ban.dto';
import { BanQueryDto } from './dto/ban.query.dto';
import { BanEntity } from './entity/ban.entity';

@Controller('ban')
export class BanController {
    constructor(
        private readonly banService: BanService,
        private readonly userService: UserService,
        private readonly roomService: RoomService,
    ) { 
        this.banLogger = new Logger(BanController.name);
    }
    private readonly banLogger: Logger;

    /* Return all ban entities */
    @Get()
    async findAllBans(@Query() queryParams: BanQueryDto): Promise<BanEntity[]> {
        return await this.banService.findAllBans(queryParams);
    }

    /* Return a ban by id */
    @Get(':ban_id')
    async findOne(@Param('ban_id', ParseIntPipe) banId: number): Promise<BanEntity> { 
        const ban = await this.banService.findOne(banId);
        if (ban === null) {
            this.banLogger.error('Ban with id ' + banId + ' not found in database');
            throw new HttpException('no ban entity in db', HttpStatus.NOT_FOUND);
        }
        return ban;
    }

    /* Return all bans in a room */
    @Get('/rooms/:room_id')
    async getBannedUsersInRoom(@Param('room_id', ParseIntPipe) roomId: number): Promise<UserEntity[]> {
        return await this.banService.getBannedUsersInRoom(roomId);
    }

    /* Return all rooms in which an user is banned */
    @Get('/users/:user_id')
    async getRoomsWithUserBanned(@Param('user_id', ParseIntPipe) userId: number): Promise<RoomEntity[]> {
        return await this.banService.getRoomsWithUserBanned(userId);
    }

    /* Create a ban */
    //@UseGuards(AtLeastRoomOwner)
    @Post()
    async createBan(@Body() dto: CreateBanDto): Promise<BanEntity> {
        const { userId, roomId } = dto;
        if (await this.userService.findOne(userId) === null) {
            this.banLogger.error('User with id ' + userId + ' not found in database');
            throw new HttpException('user not found in db', HttpStatus.NOT_FOUND);
        }
        if (await this.roomService.findOne(roomId) === null) {
            this.banLogger.error('Room with id ' + roomId + ' not found in database');
            throw new HttpException('room not found in db', HttpStatus.NOT_FOUND);
        }
        if (await this.banService.findOneByIds(userId, roomId) !== null) {
            this.banLogger.error('Ban to user ' + userId + ' in room ' + roomId + ' already in db');
            throw new HttpException('ban already in db', HttpStatus.BAD_REQUEST);
        }
        return await this.banService.createBan(dto);
    }

    /* Delete a ban */
    //@UseGuards(AtLeastRoomOwner)
    @Delete(':ban_id')
    async deleteBan(@Param('ban_id', ParseIntPipe) ban_id: number): Promise<void> {
        return await this.banService.deleteBan(ban_id);
    }
}
