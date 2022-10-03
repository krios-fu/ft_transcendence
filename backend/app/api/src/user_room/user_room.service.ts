import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/room/entity/room.entity';
import { RoomService } from 'src/room/room.service';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UserRoomDto } from './dto/user_room.dto';
import { UserRoomEntity } from './entity/user_room.entity';
import { UserRoomRepository } from './repository/user_room.repository';

@Injectable()
export class UserRoomService {
  constructor (
    @InjectRepository(UserRoomEntity)
    private readonly userRoomRepository: UserRoomRepository,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) { }
  async create(newDto: UserRoomDto) {
      const userInRoom = new UserRoomEntity(newDto);
      return await this.userRoomRepository.save(userInRoom);
  }

  async findAll(): Promise<UserRoomEntity[]> {
    return await this.userRoomRepository.find();
  }

  async findOne(id: number): Promise<UserRoomEntity> { 
    return await this.userRoomRepository.findOne({
      where: { id: id },
    });
  }

  async getAllUsersInRoom(room_id: string): Promise<UserEntity[]> {
    const userList = this.userRoomRepository.find({
      select: { user_id: true },
      relations: {
        room: true,
        user: true,
      },
      where: { room_id: room_id },
    });

    /* debug */
    console.log(userList);

    /* tmp */
    var usersInRoom: UserEntity[] = [];
    for (var username in userList) {
      const user = await this.userService.findOne(username);
      usersInRoom.push(user);
    }
    return usersInRoom;
  }

  async getAllRoomsWithUser(user_id: string): Promise<RoomEntity[]>  {
    let rooms: RoomEntity[] = [];

    const userRooms = await this.userRoomRepository.find({
      relations: { room: true },
      where:     { user_id: user_id },
    });

    /* debugggg */
    console.log(userRooms);
    /* ........ */

    for (let userRoom of userRooms) {
      rooms.push(userRoom.room);
    }
    return rooms;
  }

  async remove(id: number) {
    const room = await this.userRoomRepository.findOne({
      select: { room_id: true },
      where: { id: id },
    });
    await this.userRoomRepository.delete(id);
    /* need to check if room is removable */
    const isEmpty = await this.getAllUsersInRoom(room.room_id);
    if (isEmpty.length === 0) {
      await this.roomService.removeRoom(room.room_id);
    }
  }
}
