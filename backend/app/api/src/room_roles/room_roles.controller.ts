import { RolesEntity } from 'src/roles/entity/roles.entity';
import { CreateRoomRolesDto, UpdateRoomRolesDto } from './dto/room_roles.dto';
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
  ClassSerializerInterceptor, 
  UseInterceptors, 
  Logger,
  HttpException,
  HttpStatus,
  Put,
  Query
} from '@nestjs/common';
import { RoomService } from 'src/room/room.service';
import { RolesService } from 'src/roles/roles.service';

@Controller('room-roles')
@UseInterceptors(ClassSerializerInterceptor)
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
    public async findAll(@Query() queryParams): Promise<RoomRolesEntity[]> {
        return this.roomRolesService.findAll();
    }

    @Get(':id')
    public async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoomRolesEntity> {
        const roomRole = await this.roomRolesService.findOne(id);
        if (roomRole === null) {
            this.roomRoleLogger.error('Room role with id ' + id + ' not found in database');
            throw new HttpException('no room role in db', HttpStatus.NOT_FOUND);
        }
        return roomRole;
    }

    /* Get role of an specific room */
    @Get('/rooms/:room_id')
    public async findRoleRoom(@Param('room_id', ParseIntPipe) roomId: number): Promise<RolesEntity> {
        if (await this.roomService.findOne(roomId) === null) {
            this.roomRoleLogger.error('Room with id ' + roomId + ' not found in database');
            throw new HttpException('no room in db', HttpStatus.NOT_FOUND);
        }
        return this.roomRolesService.findRoleRoom(roomId);
    }

    @Post()
    public async create(@Body() dto: CreateRoomRolesDto): Promise<RoomRolesEntity> {
        const { roomId, roleId } = dto;
        if (await this.roomService.findOne(roomId) === null) {
            this.roomRoleLogger.error('No room with id ' + roomId + ' found in database');
            throw new HttpException('no room in db', HttpStatus.NOT_FOUND);
        }
        if (await this.rolesService.findOne(roleId) === null) {
            this.roomRoleLogger.error('No role with id ' + roomId + ' found in database');
        }
        return this.roomRolesService.create(dto);
    }

    @Put(':id')
    // UseGuard(PrivateRoom)
    // UseGuard(AtLeastRoomOwner)
    public async updateRoomRole
    (
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateRoomRolesDto,
    ): Promise<RoomRolesEntity> {
        if (await this.roomRolesService.findOne(id) === null) {
            this.roomRoleLogger.error('No role for room with id ' + id + ' found in database');
            throw new HttpException('no role room in db', HttpStatus.NOT_FOUND);
        }
        return this.roomRolesService.updateRoomRole(id, dto);
    }

    /* Update a room password ?? */
        /* UseGuards(RoomOwner) ~~ check if user owns the room ~~
        @Put(':room_id')
        public async changePwd(@Body creds: RoomPasswordDto ~~ @IsString() oldPwd, @IsString() newPwd ~~) {
            return await this.roomService.changePwd(); ~~ first checks oldPwd, then changes entity ~~
        }
        */

    @Delete(':id')
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
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
