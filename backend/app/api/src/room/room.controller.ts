import { Body, Controller, Post } from '@nestjs/common';
import { UsersEntity } from '../users/users.entity';
import { RoomEntity } from './room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomDto } from './room.dto';
import { RoomService } from './room.service';
import { Public } from 'src/auth/public.decorator';

@Controller('room')
export class RoomController {
    constructor(
        private roomService: RoomService,
    ) {}

    @Public()
    @Post()
    async create(@Body() newRoom: RoomDto) {
        await this.roomService.createRoom(newRoom);
    }




}
