import { RolesEntity } from 'src/roles/entity/roles.entity';
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
  HttpException,
  HttpStatus,
  Put,
  Query,
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { RoomService } from 'src/room/room.service';
import { RolesService } from 'src/roles/roles.service';
import { RoomRolesQueryDto } from './dto/room_roles.query.dto';
import { UserCreds } from 'src/common/decorators/user-cred.decorator';
import { RoomEntity } from 'src/room/entity/room.entity';

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
    public async findAll(@Query() queryParams: RoomRolesQueryDto): Promise<RoomRolesEntity[]> {
        return this.roomRolesService.findAll(queryParams);
    }

    @Get(':id')
    public async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoomRolesEntity> {
        const roomRole = await this.roomRolesService.findOne(id);
        if (roomRole === null) {
            this.roomRoleLogger.error(`Room role with id ${id} not found in database`);
            throw new NotFoundException('no room role in db');
        }
        return roomRole;
    }

    /* Get roles of an specific room */
    /* what do we return if a room has no roles ?? */
    @Get('/rooms/:room_id')
    public async findRolesOfRoom(@Param('room_id', ParseIntPipe) roomId: number): Promise<RolesEntity[]> {
        if (await this.roomService.findOne(roomId) === null) {
            this.roomRoleLogger.error('Room with id ' + roomId + ' not found in database');
            throw new HttpException('no room in db', HttpStatus.NOT_FOUND);
        }
        return this.roomRolesService.findRolesRoom(roomId);
    }

    @Post()
    public async create
    (
        @UserCreds() username: string,
        @Body() dto: CreateRoomRolesDto
    ): Promise<RoomRolesEntity> {
        const { roomId, roleId } = dto;
        const roleEntity: RolesEntity = await this.rolesService.findOne(roleId);
        if (roleEntity === null) {
            this.roomRoleLogger.error(`'No role with id ${roomId} found in database`);
            throw new BadRequestException('resource not found in database');
        }
        const roomEntity: RoomEntity = await this.roomService.findOne(roomId);
        if (roomEntity === null) {
            this.roomRoleLogger.error( `No room with id ${roomId} found in database`);
            throw new NotFoundException('no room in db');
        }
        const { role } = roleEntity;
        if (await this.roomRolesService.validateRoomRole(role, username, roomId) === null) {
            this.roomRoleLogger.error(`User ${username} is not authorized for this action`);
            throw new ForbiddenException('not authorized')
        }
        return this.roomRolesService.create(dto);
    }

    @Put('room/:id/update')
    public async updatePassword
    (
        @Param('id', ParseIntPipe) id: number,
        @UserCreds() username: string,
        @Body() dto: UpdatePasswordDto,
    ): Promise<RoomRolesEntity> {
        const roomRole = await this.roomRolesService.findPrivateRoleInRoom(id);
        if (roomRole === null) {
            this.roomRoleLogger.error(`No role for room with id ${id} found in database`);
            throw new NotFoundException('no role room in db');
        }
        const { roomId, password } = roomRole;
        if (await this.roomRolesService.validateRoomRole('private', username, roomId) === false) {
            this.roomRoleLogger.error(`User ${username} is not allowed to do this action`);
            throw new ForbiddenException('User not allowed to do this action');
        }
        const newRoomRole = await this.roomRolesService.updatePassword(id, password, dto);
        if (newRoomRole === null) {
            throw new ForbiddenException('no');
        }
        return newRoomRole;
    }

    @Delete(':id')
    public async remove
    (
        @Param('id', ParseIntPipe) id: number,
        @UserCreds() username: string
    ): Promise<void> {
        const roomRole: RoomRolesEntity = await this.roomRolesService.findOne(id);

        if (roomRole === null) {
            this.roomRoleLogger.error(`No role for room with id ${id} found in database`);
            throw new NotFoundException('No role room in db');
        }
        const { roomId, role } = roomRole
        if (await this.roomRolesService.validateRoomRole(role.role, username, roomId) === false) {
            this.roomRoleLogger.error(`User ${username} is not authorized for this action`);
            throw new ForbiddenException('not authorized')
        }
        await this.roomRolesService.remove(id);
    }
}

/*
  Create a role for a room: web admin needed 
  Delete a role from a room: web admin needed
  Get roles from rooms
  Get role from a room
  Update a room role: web admin needed
*/
