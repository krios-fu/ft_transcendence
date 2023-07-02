import { Body, 
    Controller, 
    Delete, 
    Get, 
    NotFoundException,
    BadRequestException,
    Logger, 
    Param, 
    ParseIntPipe, 
    Post,
    HttpCode,
    Query, 
    UseGuards} from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { RoomService } from 'src/room/room.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRoomEntity } from 'src/user_room/entity/user_room.entity';
import { UserRoomService } from 'src/user_room/user_room.service';
import { CreateUserRoomRolesDto, UserRoomRolesDto } from './dto/user_room_roles.dto';
import { UserRoomRolesQueryDto } from './dto/user_room_roles.query.dto';
import { UserRoomRolesEntity } from './entity/user_room_roles.entity';
import { UserRoomRolesService } from './user_room_roles.service';
import { DelRolesGuard } from 'src/common/guards/del-roles.guard';
import { AllowedRoles } from 'src/common/decorators/allowed.roles.decorator';
import { PostRolesGuard } from 'src/common/guards/post-roles.guard';

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
    public async findAllRoles(@Query() queryParams?: UserRoomRolesQueryDto): Promise<UserRoomRolesEntity[]> {
        return await this.userRoomRolesService.findAllRoles(queryParams);
    }

    /* Get user with role in a room */
    @Get(':id')
    public async findRole(@Param('id', ParseIntPipe) id: number): Promise<UserRoomRolesEntity> {
        const role: UserRoomRolesEntity = await this.userRoomRolesService.findRole(id);

        if (role === null) {
            this.userRoomRolesLogger.error(`No user role in room with id ${id} present in database`);
            throw new NotFoundException('resource not found in database');
        }
        return role;
    }

    /* Get all users with roles in a room */
    @Get('/rooms/:room_id')
    public async getRolesFromRoom(@Param('room_id', ParseIntPipe) roomId: number): Promise<UserRoomRolesEntity[]> {
        if (await this.roomService.findOne(roomId) === null) {
            this.userRoomRolesLogger.error(`No room with id ${roomId} present in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userRoomRolesService.getRolesFromRoom(roomId);
    }

    /* Get all users with a specific role in a room */
    @Get('/rooms/:room_id/roles/:role_id')
    public async getUsersInRoomByRole(
        @Param('room_id', ParseIntPipe) roomId: number,
        @Param('role_id', ParseIntPipe) roleId: number,
    ): Promise<UserEntity[]> {
        if (await this.roomService.findOne(roomId) === null) {
            this.userRoomRolesLogger.error('No room with id ' + roomId + ' present in database');
            throw new NotFoundException('resource not found in database');
        }
        if (await this.rolesService.findOne(roleId) === null) {
            this.userRoomRolesLogger.error(`No role with id ${roleId} present in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userRoomRolesService.getUsersInRoomByRole(roomId, roleId);
    }

    @Get('/users/:user_id/rooms/:room_id/roles/:role_id')
    public async getRoleByIds(
        @Param('user_id', ParseIntPipe) userId: number,
        @Param('room_id', ParseIntPipe) roomId: number,
        @Param('role_id', ParseIntPipe) roleId: number
    ): Promise<UserRoomRolesEntity> {
        if(
            await this.rolesService.findOne(roleId) === null ||
            await this.userRoomService.findUserRoomIds(userId, roomId) === null
        ) {
            this.userRoomRolesLogger.error('user role in room not found in database');
            throw new NotFoundException('resource not found in database');
        }
        const role: UserRoomRolesEntity = await this.userRoomRolesService.findRoleByAllIds(userId, roomId, roleId);
        if (role === null) {
            this.userRoomRolesLogger.error('user role in room not found in database');
            throw new NotFoundException('resource not found in database');
        }
        return role;
    }


    @Get('/users/:user_id/rooms/:room_id')
    public async getRoleUser(
        @Param('user_id', ParseIntPipe) userId: number,
        @Param('room_id', ParseIntPipe) roomId: number,
    ): Promise<UserRoomRolesEntity[]> {
        if(
            await this.userRoomService.findUserRoomIds(userId, roomId) === null
        ) {
            this.userRoomRolesLogger.error('user role in room not found in database');
            throw new NotFoundException('resource not found in database');
        }
        const role: UserRoomRolesEntity []= await this.userRoomRolesService.findRoleByUser(userId, roomId);
        if (role === null) {
            this.userRoomRolesLogger.error('user role in room not found in database');
            throw new NotFoundException('resource not found in database');
        }
        return role;
    }

    @UseGuards(PostRolesGuard)
    @AllowedRoles('admin')
    @Post()
    public async postRoleInRoom(
        @Body() dto: CreateUserRoomRolesDto,
    ): Promise<UserRoomRolesEntity> {
        const { userId, roomId, roleId } = dto;
        const userRoom: UserRoomEntity[] = await this.userRoomService.findAll({ 
            filter: { userId: [ userId ], roomId: [ roomId ] }
        });

        console.log(`received roles: ${userId}, ${roomId}, ${roleId}`);
        if (!userRoom.length) {
            this.userRoomRolesLogger.error(`User ${userId} is not registered in room ${roomId}`);
            throw new BadRequestException('resource not found in database');
        }
        const userRoomId: number = userRoom[0].id;
        if (await this.rolesService.findOne(roleId) === null) {
            this.userRoomRolesLogger.error(`No role with id ${roleId} present in database`);
            throw new BadRequestException('resource not found in database');
        }
        if (await this.userRoomRolesService.findRoleByIds(userRoomId, roleId) !== null) {
            this.userRoomRolesLogger.error(`User role ${userRoomId} with role ${roleId} already in database`);
            throw new BadRequestException('resource already in database');
        }
        /* validate roles: admin, owner, site-admin */
        return await this.userRoomRolesService.postRoleInRoom(
            new UserRoomRolesDto({
                "userRoomId": userRoomId,
                "roleId": roleId
            })
        );
    }

    @UseGuards(DelRolesGuard)
    @HttpCode(204)
    @AllowedRoles('admin')
    @Delete(':id')
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        const role: UserRoomRolesEntity = await this.userRoomRolesService.findRole(id);

        /* validate roles: admin, owner, site-admin */
        if (!role) {
            this.userRoomRolesLogger.error(`No user role in room with id ${id} present in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userRoomRolesService.remove(role);
    }
}
