import { Injectable } from '@nestjs/common';
import { CreateUsersRoomDto } from './dto/create-users_room.dto';
import { UpdateUsersRoomDto } from './dto/update-users_room.dto';

@Injectable()
export class UsersRoomService {
  create(createUsersRoomDto: CreateUsersRoomDto) {
    return 'This action adds a new usersRoom';
  }

  findAll() {
    return `This action returns all usersRoom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersRoom`;
  }

  update(id: number, updateUsersRoomDto: UpdateUsersRoomDto) {
    return `This action updates a #${id} usersRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersRoom`;
  }
}
