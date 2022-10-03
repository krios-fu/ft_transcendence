import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Patch } from '@nestjs/common';
import { RolesEntity } from 'src/roles/entity/roles.entity';
import { CreateRoomRolesDto, UpdateRoomRolesDto } from './dto/room_roles.dto';
import { RoomRolesEntity } from './entity/room_roles.entity';
import { RoomRolesService } from './room_roles.service';

@Controller('room-roles')
export class RoomRolesController {
  constructor(private readonly roomRolesService: RoomRolesService) {}

  @Post()
  public async create(@Body() dto: CreateRoomRolesDto): Promise<RoomRolesEntity> {
    return this.roomRolesService.create(dto);
  }

  @Get()
  public async findAll(): Promise<RoomRolesEntity[]> {
    return this.roomRolesService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<RoomRolesEntity> {
    return this.roomRolesService.findOne(id);
  }

  /* Get role of an specific room */
  @Get('/rooms/:room_id')
  public async findRoleRoom(@Param('room_id') roomId: string): Promise<RolesEntity> {
    return this.roomRolesService.findRoleRoom(roomId);
  }

  @Patch('/:id')
  public async updateRoomRole
  (
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomRolesDto,
  ): Promise<RoomRolesEntity> {
    return this.roomRolesService.updateRoomRole(id, dto);
  }

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
