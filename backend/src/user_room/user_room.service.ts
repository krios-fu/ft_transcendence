import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from '../common/mappers/query.mapper';
import { RoomEntity } from '../room/entity/room.entity';
import { RoomService } from '../room/room.service';
import { RoomRolesService } from '../room_roles/room_roles.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { CreateUserRoomDto } from './dto/user_room.dto';
import { UserRoomQueryDto } from './dto/user_room.query.dto';
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

    public async findAll(queryParams: UserRoomQueryDto): Promise<UserRoomEntity[]> {
        if (queryParams !== undefined) {
            return await this.userRoomRepository.find(new QueryMapper(queryParams));
        }
        return await this.userRoomRepository.find();
    }

    public async findOne(id: number): Promise<UserRoomEntity> { 
        return await this.userRoomRepository.findOne({
            where: { id: id },
        });
    }

    public async getAllUsersInRoom(roomId: number): Promise<UserRoomEntity[]> {
        const userList = await this.userRoomRepository.find({
        select: { userId: true },
        relations: {
            room: true,
            user: true,
        },
        where: { roomId: roomId },
        });

        /* debug */
        console.log('GET ALL USERS',userList);

        // /* tmp */ //deleted for krios-fu
        // he modificado esta query para hacer uso.
        // var usersInRoom: UserEntity[] = [];
        // for (var username in userList) {
        // const user = await this.userService.findOneByUsername(username);
        // usersInRoom.push(user);
        // }
        return userList;
    }

    public async getAllRoomsWithUser(userId: number): Promise<RoomEntity[]>  {
        let rooms: RoomEntity[] = [];

        const userRooms = await this.userRoomRepository.find({
        relations: { room: true },
        where:     { userId: userId },
        });

        for (let userRoom of userRooms) {
        rooms.push(userRoom.room);
        }
        return rooms;
    }

    public async create(newDto: CreateUserRoomDto) {
        const userInRoom = new UserRoomEntity(newDto);
        return await this.userRoomRepository.save(userInRoom);
    }

    public async remove(id: number): Promise<void> {
        const roomRole = await this.userRoomRepository.findOne({
            select: { roomId: true },
            where: { id: id },
        });
        if (roomRole === null) {
            throw new NotFoundException('resource not found');
        }
        await this.userRoomRepository.delete(id);
        if (await this.roomRolesService.isRole('official', roomRole.roomId) === true) {
            return ;
        }
        const isEmpty = await this.getAllUsersInRoom(roomRole.roomId);
        if (isEmpty.length === 0) {
            await this.roomService.removeRoom(roomRole.room);
        }
        /* new owner logic goes here */
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
