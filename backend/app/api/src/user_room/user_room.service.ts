import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/room/entity/room.entity';
import { RoomService } from 'src/room/room.service';
import { RoomRolesService } from 'src/room_roles/room_roles.service';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateUserRoomDto } from './dto/user_room.dto';
import { UserRoomEntity } from './entity/user_room.entity';
import { UserRoomRepository } from './repository/user_room.repository';

@Injectable()
export class UserRoomService {
    constructor (
        @InjectRepository(UserRoomEntity)
        private readonly userRoomRepository: UserRoomRepository,
        private readonly roomRolesService: RoomRolesService,
        private readonly roomService: RoomService,
        private readonly userService: UserService,
    ) { }

    public async create(newDto: CreateUserRoomDto) {
        const userInRoom = new UserRoomEntity(newDto);
        return await this.userRoomRepository.save(userInRoom);
    }

    public async findAll(): Promise<UserRoomEntity[]> {
        return await this.userRoomRepository.find(/* ??? */);
    }

    public async findOne(id: number): Promise<UserRoomEntity> { 
        return await this.userRoomRepository.findOne({
            where: { id: id },
        });
    }

    public async getAllUsersInRoom(roomId: number): Promise<UserEntity[]> {
        const userList = this.userRoomRepository.find({
        select: { userId: true },
        relations: {
            room: true,
            user: true,
        },
        where: { roomId: roomId },
        });

        /* debug */
        console.log(userList);

        /* tmp */
        var usersInRoom: UserEntity[] = [];
        for (var username in userList) {
        const user = await this.userService.findOneByUsername(username);
        usersInRoom.push(user);
        }
        return usersInRoom;
    }

    public async getAllRoomsWithUser(userId: number): Promise<RoomEntity[]>  {
        let rooms: RoomEntity[] = [];

        const userRooms = await this.userRoomRepository.find({
        relations: { room: true },
        where:     { userId: userId },
        });

        /* debugggg */
        console.log(userRooms);
        /* ........ */

        for (let userRoom of userRooms) {
        rooms.push(userRoom.room);
        }
        return rooms;
    }

    public async remove(id: number): Promise<void> {
        const roomRole = await this.userRoomRepository.findOne({
            select: { roomId: true },
            where: { id: id },
        });
        if (roomRole === null) {
            return ;
        }
        await this.userRoomRepository.delete(id);
        if (await this.roomRolesService.isRole('official', roomRole.roomId) === true) {
            return ;
        }
        const isEmpty = await this.getAllUsersInRoom(roomRole.roomId);
        if (isEmpty.length === 0) {
        await this.roomService.removeRoom(roomRole.roomId);
        }
    }

    public async findUserRoomIds(userId: number, roomId: number): Promise<UserRoomEntity> {
        return await this.userRoomRepository.findOne({
            where: {
                userId: userId,
                roomId: roomId
            }
        });
    }
}
