import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { RolesRoomDto } from './dto/roles_room.dto';
import { RolesRoomEntity } from './entities/roles_room.entity';
import { RolesRoomService } from './roles_room.service';

@Controller('roles_room')
export class RolesRoomController {
    constructor(private readonly rolesRoomService: RolesRoomService) { }

    @Get(':id')
    async getRole(@Param('id') id): Promise<RolesRoomEntity> { 
        return await this.rolesRoomService.getRole(id);
    }

    @Get('/rooms/:room_id')
    async getRolesFromRoom(@Param('room_id') room_id: string): Promise<RolesRoomEntity[]> { 
        return this.rolesRoomService.getRolesFromRoom(room_id);
    }

    @Get('/rooms/:room_id/roles/:role_id')
    async getUsersInRoomByRole(
        @Param('room_id') room_id: string,
        @Param('role_id') role_id: string,
        ): Promise<UserEntity[]> {
        return await this.rolesRoomService.getRolesFromRoom(room_id, role_id);
    }

    @Post()
    async postRoleInRoom(@Body() rolesRoomDto: RolesRoomDto): Promise<RolesRoomEntity> { 
        return await this.rolesRoomService.postRoleInRoom(rolesRoomDto);
    }

    @Delete(':id')
    async remove(@Param(ParseIntPipe, 'id') id: number): Promise<void> {
        return await this.remove(id);
    }
}
