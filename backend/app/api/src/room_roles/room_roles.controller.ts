import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomRolesService } from './room_roles.service';
import { CreateRoomRoleDto } from './dto/create-room_role.dto';
import { UpdateRoomRoleDto } from './dto/update-room_role.dto';

@Controller('room-roles')
export class RoomRolesController {
  constructor(private readonly roomRolesService: RoomRolesService) {}

  @Post()
  create(@Body() createRoomRoleDto: CreateRoomRoleDto) {
    return this.roomRolesService.create(createRoomRoleDto);
  }

  @Get()
  findAll() {
    return this.roomRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomRolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomRoleDto: UpdateRoomRoleDto) {
    return this.roomRolesService.update(+id, updateRoomRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomRolesService.remove(+id);
  }
}

/*
  Create a role for a room: web admin needed 
  Delete a role from a room: web admin needed
  Get roles from rooms
  Get role from a room
  Update a room role: web admin needed
*/
