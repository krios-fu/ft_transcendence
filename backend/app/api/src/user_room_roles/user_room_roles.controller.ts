import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { RolesRoomDto } from './dto/roles_room.dto';
import { RolesRoomEntity } from './entity/roles_room.entity';
import { RolesRoomService } from './roles_room.service';

@Controller('user_room_roles')
export class RolesRoomController {
    constructor(private readonly rolesRoomService: RolesRoomService) { }

    /* Get all users with roles in rooms */
    @Get(':id')
    async getRole(@Param('id') id): Promise<RolesRoomEntity> { 
        return await this.rolesRoomService.getRole(id);
    }

    /* Get all users with roles in a room */
    @Get('/rooms/:room_id')
    async getRolesFromRoom(@Param('room_id') room_id: string): Promise<RolesRoomEntity[]> { 
        return this.rolesRoomService.getRolesFromRoom(room_id);
    }

    /* Get all users with a specific role in a room */
    @Get('/rooms/:room_id/roles/:role_id')
    async getUsersInRoomByRole(
        @Param('room_id') room_id: string,
        @Param('role_id') role_id: string,
        ): Promise<UserEntity[]> {
        return await this.rolesRoomService.getUsersInRoomByRole(room_id, role_id);
    }

    /* Create a new user with a role in a room */
    /* at least mod role required */
    @Post()
    async postRoleInRoom(@Body() rolesRoomDto: RolesRoomDto): Promise<RolesRoomEntity> { 
        return await this.rolesRoomService.postRoleInRoom(rolesRoomDto);
    }

    /* Delete a user with role in a room */
    /* at least mod role required */
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.remove(id);
    }
}
