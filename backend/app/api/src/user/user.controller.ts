import {
    Controller,
    Get,
    Post,
    Param,
    Body,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersEntity } from './user.entity';
import { UsersDto } from './user.dto';
import { Public } from '../decorators/public.decorator';
// import { RoomDto } from 'src/room/room.dto';
import { Repository } from 'typeorm';
// import { RoomEntity } from 'src/room/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
// import { RoomService } from '../room/room.service';
import { identity } from 'rxjs';

@Controller('users')
export class UsersController {
    constructor(
        // private roomService: RoomService,
        private usersService: UsersService,
    ) {
        console.log("UsersController inicializado");
    }

    // @Public()
    @Get()
    async findAllUsers(): Promise<UsersEntity[]> {
        return this.usersService.findAllUsers();
    }

    // @Public()
    @Get(':id')
    async findOneUser(@Param('id') id: string): Promise<UsersEntity> {
        return this.usersService.findOne(id);
    }

    // @Public()
    @Post('new')
    async postUser(@Body() newUser: UsersDto): Promise<UsersEntity> {
        return this.usersService.postUser(newUser);
    }

/*     @Public()
    @Post(':id/addroom')
    async updateRoom(@Param('id') id, @Body() room: RoomDto) {
        const roomEntity = await this.roomService.createRoom(room);
        await this.usersService.updateRoom(roomEntity, id);
    } */
}
