import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/room/entity/room.entity';
import { RoomService } from 'src/room/room.service';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UsersRoomDto } from './dto/users_room.dto';
import { UsersRoomEntity } from './entity/users_room.entity';
import { UsersRoomRepository } from './repository/users_room.repository';
import { UsersRoomMapper } from './users_room.mapper';

@Injectable()
export class UsersRoomService {
  constructor (
    @InjectRepository(UsersRoomEntity)
    private readonly usersRoomRepository: UsersRoomRepository,
    private readonly usersRoomMapper: UsersRoomMapper,
    private readonly roomService: RoomService,
    private readonly userService: UserService,
  ) { }
  async create(newUsersRoomDto: UsersRoomDto) {
      const userInRoom = this.usersRoomMapper.toEntity(newUsersRoomDto)
      return await this.usersRoomRepository.save(userInRoom);
  }

  async findAll(): Promise<UsersRoomEntity[]> {
    return await this.usersRoomRepository.find();
  }

  async findOne(id: number): Promise<UsersRoomEntity> { 
    return await this.usersRoomRepository.findOne({
      where: { id: id },
    });
  }

  async getAllUsersInRoom(room_id: string): Promise<UserEntity[]> {
    const userList = this.usersRoomRepository.find({
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

  async getAllRoomsWithUser(user_id: string): Promise<RoomEntity[]> {
    //var roomsFromUser: RoomEntity[] = [];
    //const roomList = this.usersRoomRepository.find({
    //  select: { room_id: true },
    //  relations: { 
    //    room: true,
    //    user: true,
    //  },
    //  where: { user_id: user_id },
    //});
//
    ///* debug */
    //console.log(roomList);
//
    ///* tmp */
    //for (var room_name in roomList) {
    //  const room = await this.roomService.findOne(room_name);
    //  roomsFromUser.push(room);
    //}
    //return roomsFromUser;

    let rooms: RoomEntity[] = [];

    const userRooms = this.usersRoomRepository.find({
      select:    { room: true }, /* WHYYYYY */
      relations: { room: true },
      where:     { user_id: user_id },
    });

    /* debugggg */
    console.log(userRooms);
    /* ........ */

    for (let room in userRooms) {
      rooms.push(room);
    }
    return rooms;
  }

  async remove(id: number) {
    const room = await this.usersRoomRepository.findOne({
      select: { room_id: true },
      where: { id: id },
    });
    await this.usersRoomRepository.delete(id);
    /* need to check if room is removable */
    const isEmpty = await this.getAllUsersInRoom(room.room_id);
    if (isEmpty.length === 0) {
      await this.roomService.removeRoom(room.room_id);
    }
  }
}
