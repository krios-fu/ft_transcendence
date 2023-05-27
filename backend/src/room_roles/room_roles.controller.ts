import { RolesEntity } from '../roles/entity/roles.entity';
import { CreateRoomRolesDto, UpdatePasswordDto } from './dto/room_roles.dto';
import { RoomRolesEntity } from './entity/room_roles.entity';
import { RoomRolesService } from './room_roles.service';
import { 
  Controller, 
  Get, 
  Post,
  Body, 
  Param, 
  Delete, 
  ParseIntPipe, 
  Logger,
  Put,
  Query,
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { RoomService } from '../room/room.service';
import { RolesService } from '../roles/roles.service';
import { RoomRolesQueryDto } from './dto/room_roles.query.dto';
import { UserCreds } from '../common/decorators/user-cred.decorator';
import { UserCredsDto } from 'src/common/dtos/user.creds.dto';

@Controller('room_roles')
export class RoomRolesController {
    constructor
    (
        private readonly roomRolesService: RoomRolesService,
        private readonly roomService: RoomService,
        private readonly rolesService: RolesService,
    ) { 
        this.roomRoleLogger = new Logger(RoomRolesController.name);
    }
    private readonly roomRoleLogger: Logger;

    @Get()
    public async findAll(@Query() queryParams: RoomRolesQueryDto): Promise<RoomRolesEntity[] | [RoomRolesEntity[], number]> {
        if (queryParams.count)
            return this.roomRolesService.findAndCountAll(queryParams);
        return this.roomRolesService.findAll(queryParams);
    }

    @Get(':id')
    public async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoomRolesEntity> {
        const roomRole: RoomRolesEntity = await this.roomRolesService.findOne(id);

        if (roomRole === null) {
            this.roomRoleLogger.error(`Room role with id ${id} not found in database`);
            throw new NotFoundException('Role not found in database');
        }
        return roomRole;
    }

    /* Get roles of an specific room */
    /* what do we return if a room has no roles ?? */
    @Get('/rooms/:room_id')
    public async findRolesOfRoom(@Param('room_id', ParseIntPipe) roomId: number): Promise<RolesEntity[]> {
        if (await this.roomService.findOne(roomId) === null) {
            this.roomRoleLogger.error(`Room with id ${roomId} not found in database`);
            throw new NotFoundException('Room not found in database');
        }
        return await this.roomRolesService.findRolesInRoom(roomId);
    }

    @Get('/rooms/:room_id/roles/:role_id')
    public async findRoomRoleByIds(
        @Param('room_id', ParseIntPipe) roomId: number,
        @Param('role_id', ParseIntPipe) roleId: number
    ): Promise<RoomRolesEntity> {
        if (await this.roomService.findOne(roomId) === null ||
            await this.rolesService.findOne(roleId) === null) {
                this.roomRoleLogger.error('resource not found in database');
                throw new BadRequestException('Resource not found in database');
            }
        const role: RoomRolesEntity = await this.roomRolesService.findRoomRoleByIds(roomId, roleId);
        if (role === null) {
            this.roomRoleLogger.error('role not found in database');
            throw new NotFoundException('Role not found in database');
        }
        return role;
    }

    @Post()
    public async create
    (
        @UserCreds() userCreds: UserCredsDto,
        @Body() dto: CreateRoomRolesDto
    ): Promise<RoomRolesEntity> {
        const { username } = userCreds;
        const { roomId, roleId, password } = dto;
        const roleEntity: RolesEntity = await this.rolesService.findOne(roleId);

        if (roleEntity === null) {
            this.roomRoleLogger.error(`No role with id ${roomId} found in database`);
            throw new BadRequestException('resource not found in database');
        }
        if (await this.roomService.findOne(roomId) === null) {
            this.roomRoleLogger.error(`No room with id ${roomId} found in database`);
            throw new NotFoundException('resource not found in database');
        }
        const { role } = roleEntity;
        if (role === 'private' && password === undefined) {
            this.roomRoleLogger.error('Cannot create a private room without a password');
            throw new BadRequestException('Cannot create a private room without a password');
        }
        const validated: Object | null = await this.roomRolesService.checkRolesConstraints(roomId, role);
        if (validated !== null) {
            this.roomRoleLogger.error(validated['logMessage']);
            throw validated['error'];
        }
        if (await this.roomRolesService.validateRoomRole(role, username, roomId) === false) {
            this.roomRoleLogger.error(`User ${username} is not authorized for this action`);
            throw new ForbiddenException('user not authorized for this action');
        }
        return await this.roomRolesService.create(dto);
    }

    @Put('room/:id/password')
    public async updatePassword
    (
        @Param('id', ParseIntPipe) id: number,
        @UserCreds() userCreds: UserCredsDto,
        @Body() dto: UpdatePasswordDto,
    ): Promise<RoomRolesEntity> {
        const { username } = userCreds;
        const roomRole: RoomRolesEntity | null = await this.roomRolesService.findPrivateRoleInRoom(id);

        if (roomRole === null) {
            this.roomRoleLogger.error(`No role for room with id ${id} found in database`);
            throw new NotFoundException('resource not found in database');
        }
        const { roomId, password } = roomRole;
        if (await this.roomRolesService.validateRoomRole('private', username, roomId) === false) {
            this.roomRoleLogger.error(`User ${username} is not allowed to do this action`);
            throw new ForbiddenException('User not allowed to do this action');
        }
        const newRoomRole: RoomRolesEntity | null = 
            await this.roomRolesService.updatePassword(roomRole, password, dto);
        if (newRoomRole === null) {
            this.roomRoleLogger.error(`Invalid password`);
            throw new ForbiddenException('Invalid password');
        }
        return newRoomRole;
    }

    @Delete(':id')
    public async remove
    (
        @Param('id', ParseIntPipe) id: number,
        @UserCreds() userCreds: UserCredsDto
    ): Promise<void> {
        const { username } = userCreds;
        const roomRole: RoomRolesEntity = await this.roomRolesService.findOne(id);

        if (roomRole === null) {
            this.roomRoleLogger.error(`No role for room with id ${id} found in database`);
            throw new NotFoundException('resource not found in database');
        }
        const { roomId, role } = roomRole
        if (await this.roomRolesService.validateRoomRole(role.role, username, roomId) === false) {
            this.roomRoleLogger.error(`User ${username} is not authorized for this action`);
            throw new ForbiddenException('user not authorized for this action')
        }
        await this.roomRolesService.delete(id);
    }
}

/*
  Create a role for a room: web admin needed 
  Delete a role from a room: web admin needed
  Get roles from rooms
  Get role from a room
  Update a room role: web admin needed
*/
