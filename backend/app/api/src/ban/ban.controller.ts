import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RoomEntity } from 'src/room/entities/room.entity';
import { UserEntity } from 'src/user/user.entity';
import { BanService } from './ban.service';
import { BanDto } from './dto/ban.dto';
import { BanEntity } from './entity/ban.entity';

@Controller('ban')
export class BanController {
    constructor(
        private readonly banService: BanService,
    ) { }

    @Get()
    async getAllBans(): Promise<BanEntity[]> {
        return await this.banService.getAllBans();
    }

    @Get(':ban_id')
    async getOneBan(@Param('ban_id', ParseIntPipe) ban_id: number): Promise<BanEntity> { 
        return await this.banService.getOneBan(ban_id);
    }

    @Get('/rooms/:room_id')
    async getBannedUsersInRoom(@Param('room_id') room_id: string): Promise<UserEntity[]> {
        return await this.banService.getBannedUsersInRoom(room_id);
    }

    @Get('/users/:user_id')
    async getRoomsWithUserBanned(@Param('user_id') user_id: string): Promise<RoomEntity[]> {
        return await this.banService.getRoomsWithUserBanned(user_id);
    }

    @Post()
    async createBan(@Body() dto: BanDto): Promise<BanEntity> {
        return await this.banService.createBan(dto);
    }

    @Delete(':ban_id')
    async deleteBan(@Param('ban_id', ParseIntPipe) ban_id: number): Promise<void> {
        return await this.banService.deleteBan(ban_id);
    }
}
