import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { CreateUserRoomRolesDto } from './dto/user_room_roles.dto';
import { UserRoomRolesEntity } from './entity/user_room_roles.entity';
import { UserRoomRolesService } from './user_room_roles.service';

@Controller('user_room_roles')
export class UserRoomRolesController {
    constructor(private readonly UserRoomRolesService: UserRoomRolesService) { }

    /* Get user with role in a room */
    @Get(':id')
    public async getRole(@Param('id', ParseIntPipe) id: number): Promise<UserRoomRolesEntity> { 
        return await this.UserRoomRolesService.getRole(id);
    }

    /* Get all users with roles in a room */
    @Get('/rooms/:room_id')
    public async getRolesFromRoom(@Param('room_id') room_id: string): Promise<UserRoomRolesEntity[]> { 
        return this.UserRoomRolesService.getRolesFromRoom(room_id);
    }

    /* Get all users with a specific role in a room */
    @Get('/rooms/:room_id/roles/:role_id')
    public async getUsersInRoomByRole(
        @Param('room_id') room_id: string,
        @Param('role_id') role_id: string,
        ): Promise<UserEntity[]> {
        return await this.UserRoomRolesService.getUsersInRoomByRole(room_id, role_id);
    }

    /* Create a new user with a role in a room */
    /* at least mod role required */
    @Post()
    public async postRoleInRoom(@Body() newDto: CreateUserRoomRolesDto): Promise<UserRoomRolesEntity> { 
        return await this.UserRoomRolesService.postRoleInRoom(newDto);
    }

    /* Delete a user with role in a room */
    /* at least mod role required */
    @Delete(':id')
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.remove(id);
    }
}
