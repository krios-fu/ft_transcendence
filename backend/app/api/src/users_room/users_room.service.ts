import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRoomDto } from './dto/users_room.dto';
import { UsersRoomEntity } from './entities/users_room.entity';
import { UsersRoomRepository } from './repositories/users_room.repository';
import { UsersRoomMapper } from './users_room.mapper';

@Injectable()
export class UsersRoomService {
  constructor (
    @InjectRepository(UsersRoomEntity)
    private readonly usersRoomRepository: UsersRoomRepository,
    private readonly usersRoomMapper: UsersRoomMapper
  ) { }
  create(newUsersRoomDto: UsersRoomDto) {
      const userInRoom = this.usersRoomMapper.toEntity(newUsersRoomDto)
      return await this.usersRoomRepository.save(userInRoom);
  }

  findAll() {

  }

  findOne(id: number) { 

  }

  update(id: number, updateUsersRoomDto: UpdateUsersRoomDto) {
  }

  remove(id: number) {
  }
}
