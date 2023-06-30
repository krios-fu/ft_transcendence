import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpException,
    HttpStatus,
    Logger, NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { RoomEntity } from '../room/entity/room.entity';
import { RoomService } from '../room/room.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { BanService } from './ban.service';
import { CreateBanDto } from './dto/ban.dto';
import { BanQueryDto } from './dto/ban.query.dto';
import { BanEntity } from './entity/ban.entity';
import { UserRoomRolesService } from '../user_room_roles/user_room_roles.service';

@Controller('ban')
export class BanController {
    constructor(
        private readonly banService: BanService,
        private readonly userService: UserService,
        private readonly roomService: RoomService,
        private readonly rolesService: UserRoomRolesService
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
        const ban: BanEntity = await this.banService.findOne(banId);
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
    @Post()
    async createBan(@Body() dto: CreateBanDto): Promise<BanEntity> {
        const { userId, roomId } = dto;
        
        if (await this.userService.findOne(userId) === null) {
            this.banLogger.error(`User with id ${userId} not found in database`);
            throw new NotFoundException('user not found in db');
        }
        if (await this.roomService.findOne(roomId) === null) {
            this.banLogger.error(`Room with id ${roomId} not found in database`);
            throw new NotFoundException('room not found in db');
        }
        if (await this.banService.findOneByIds(userId, roomId) !== null) {
            this.banLogger.error(`Ban to user ${userId} in room ${roomId} already in db`);
            throw new BadRequestException('resource already exists in database');
        }
        if (!this.rolesService.validateUserAction(userId, roomId, ['admin'])) {
            this.banLogger.error(`User ${userId} not allowed to do this action`);
            throw new ForbiddenException('User not allowed to do this action');
        }
        return await this.banService.createBan(dto);
    }

    /* Delete a ban */
    /* baneos solamente permitidos por roles admin, owner (en user roles room) y super-admin en global */
    @Delete(':ban_id')
    async deleteBan(@Param('ban_id', ParseIntPipe) banId: number): Promise<void> {
        const ban: BanEntity | null = await this.banService.findOne(banId);

        if (!ban) {
            this.banLogger.error(`Ban not found in database`);
            throw new BadRequestException('resource not found in database');
        }
        return await this.banService.deleteBan(ban);
    }
}
