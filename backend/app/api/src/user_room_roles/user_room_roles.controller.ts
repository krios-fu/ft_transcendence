import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { RoomService } from 'src/room/room.service';
import { UserEntity } from 'src/user/user.entity';
import { UserRoomService } from 'src/user_room/user_room.service';
import { CreateUserRoomRolesDto } from './dto/user_room_roles.dto';
import { UserRoomRolesEntity } from './entity/user_room_roles.entity';
import { UserRoomRolesService } from './user_room_roles.service';

@Controller('user_room_roles')
export class UserRoomRolesController {
    constructor(
        private readonly userRoomRolesService: UserRoomRolesService,
        private readonly userRoomService: UserRoomService,
        private readonly roomService: RoomService,
        private readonly rolesService: RolesService,
    ) { 
        this.userRoomRolesLogger = new Logger(UserRoomRolesService.name);
    }
    private readonly userRoomRolesLogger: Logger;

    /* get all users in room with roles */
    @Get()
    public async findAllRoles(@Query() queryParams): Promise<UserRoomRolesEntity[]> {
        return await this.userRoomRolesService.getAllRoles(/* !??! */);
    }

    /* Get user with role in a room */
    @Get(':id')
    public async findRole(@Param('id', ParseIntPipe) id: number): Promise<UserRoomRolesEntity> { 
        const role = await this.userRoomRolesService.getRole(id);
        if (role === null) {
            this.userRoomRolesLogger.error('No user role in room with id ' + id + ' present in database');
            throw new HttpException('no role in db', HttpStatus.NOT_FOUND);
        }
        return role;
    }

    /* Get all users with roles in a room */
    @Get('/rooms/:room_id')
    public async getRolesFromRoom(@Param('room_id', ParseIntPipe) roomId: number): Promise<UserRoomRolesEntity[]> {
        if (await this.roomService.findOne(roomId) === null) {
            this.userRoomRolesLogger.error('No room with id ' + roomId + ' present in database');
            throw new HttpException('no room in db', HttpStatus.NOT_FOUND);
        }
        return this.userRoomRolesService.getRolesFromRoom(roomId);
    }

    /* Get all users with a specific role in a room */
    @Get('/rooms/:room_id/roles/:role_id')
    public async getUsersInRoomByRole(
        @Param('room_id', ParseIntPipe) roomId: number,
        @Param('role_id', ParseIntPipe) roleId: number,
    ): Promise<UserEntity[]> {
        if (await this.roomService.findOne(roomId) === null) {
            this.userRoomRolesLogger.error('No room with id ' + roomId + ' present in database');
            throw new HttpException('no room in db', HttpStatus.NOT_FOUND);
        }
        if (await this.rolesService.findOne(roleId) === null) {
            this.userRoomRolesLogger.error('No role with id ' + roleId + ' present in database');
            throw new HttpException('no role in db', HttpStatus.NOT_FOUND);
        }
        return await this.userRoomRolesService.getUsersInRoomByRole(roomId, roleId);
    }

    /* Create a new user with a role in a room */
    /* at least mod role required */
    @Post()
    public async postRoleInRoom(@Body() dto: CreateUserRoomRolesDto): Promise<UserRoomRolesEntity> {
        const { userRoomId, roleId } = dto;
        if (await this.rolesService.findOne(roleId) === null) {
            this.userRoomRolesLogger.error('No role with id ' + roleId + ' present in database');
            throw new HttpException('no role in db', HttpStatus.BAD_REQUEST);
        }
        if (await this.userRoomService.findOne(userRoomId) === null) {
            this.userRoomRolesLogger.error('No user in room with id ' + userRoomId + ' present in database');
            throw new HttpException('no user in room', HttpStatus.BAD_REQUEST);
        }
        if (await this.userRoomRolesService.findRoleByIds(userRoomId, roleId) !== null) {
            this.userRoomRolesLogger.error('User role ' + userRoomId + ' with role ' + roleId + ' already in database');
            throw new HttpException('role already in db', HttpStatus.BAD_REQUEST);
        }
        return await this.userRoomRolesService.postRoleInRoom(dto);
    }

    /* Delete a user with role in a room */
    /* at least mod role required */
    @Delete(':id')
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.remove(id);
    }
}
