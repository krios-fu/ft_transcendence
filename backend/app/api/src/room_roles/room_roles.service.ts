import { Injectable } from '@nestjs/common';
import { CreateRoomRoleDto } from './dto/create-room_role.dto';
import { UpdateRoomRoleDto } from './dto/update-room_role.dto';

@Injectable()
export class RoomRolesService {
  create(createRoomRoleDto: CreateRoomRoleDto) {
    return 'This action adds a new roomRole';
  }

  findAll() {
    return `This action returns all roomRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomRole`;
  }

  update(id: number, updateRoomRoleDto: UpdateRoomRoleDto) {
    return `This action updates a #${id} roomRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomRole`;
  }
}
