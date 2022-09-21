import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesRoomDto } from './dto/roles_room.dto';
import { RolesRoomEntity } from './entities/roles_room.entity';
import { RolesRoomService } from './roles_room.service';

@Controller('roles-room')
export class RolesRoomController {
    constructor(private readonly rolesRoomService: RolesRoomService) { }

    @Get(':id')
    async getRole(@Param('id') id): Promise<RolesRoomEntity> { 
        return this.rolesRoomService.getRole(id);
    }

    @Get('/rooms/:room_id')
    async getRolesFromRoom(@Param('room_id') room_id: Promise<RolesRoomEntity[]>) { 
        return this.rolesRoomService.getRolesFromRoom(room_id);
    }

    @Post()
    async postRoleInRoom(@Body() rolesRoomDto: RolesRoomDto): Promise<RolesRoomEntity> { 
        return this.rolesRoomService.postRoleInRoom();
    }
}
