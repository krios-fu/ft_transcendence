import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from 'src/common/mappers/query.mapper';
import { RoomEntity } from 'src/room/entity/room.entity';
import { RoomService } from 'src/room/room.service';
import { RoomRolesEntity } from 'src/room_roles/entity/room_roles.entity';
import { RoomRolesService } from 'src/room_roles/room_roles.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
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

        for (let userRoom of userRooms) {
        rooms.push(userRoom.room);
        }
        return rooms;
    }

    public async create(newDto: CreateUserRoomDto) {
        const userInRoom = new UserRoomEntity(newDto);
        return await this.userRoomRepository.save(userInRoom);
    }


    // if user exits room being an owner, remove it from owner //
    public async remove(id: number): Promise<void> {
        const roomRole: RoomRolesEntity = await this.userRoomRepository.findOne({
            select: { roomId: true },
            where: { id: id },
        });

        if (roomRole === null) {
            throw new NotFoundException('resource not found');
        }
        const { room, user_id } = roomRole;
        const { room_id, owner_id } = room;
        
        await this.userRoomRepository.delete(id);
        if (await this.roomRolesService.isRole('official', roomRole.roomId) === true) {
            return ;
        }
        if ((await this.getAllUsersInRoom(roomRole.roomId)).length === 0) {
            await this.roomService.removeRoom(room);
        }
        if (owner_id === user_id) {
            this.roomService.updateRoomOwner(room_id);
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
