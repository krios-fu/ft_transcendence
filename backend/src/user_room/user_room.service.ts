import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenWsException } from 'src/game/exceptions/forbidden.wsException';
import { QueryMapper } from '../common/mappers/query.mapper';
import { RoomEntity } from '../room/entity/room.entity';
import { RoomService } from '../room/room.service';
import { RoomRolesService } from '../room_roles/room_roles.service';
import { CreatePrivateUserRoomDto, CreateUserRoomDto } from './dto/user_room.dto';
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

    public async findUserRoomIds(userId: number, roomId: number): Promise<UserRoomEntity> {
        return await this.userRoomRepository.findOne({
            where: {
                userId: userId,
                roomId: roomId
            }
        });
    }

    /* no entiendo la query del servicio de abajo, pero por si acaso no la toco y monto esta */
    public async findByRoomId(roomId: number): Promise<UserRoomEntity[]> {
        return await this.userRoomRepository.createQueryBuilder('user_room')
            .leftJoinAndSelect('user_room.user', 'user')
            .leftJoinAndSelect('user_room.room', 'room')
            .where('user_room.roomId = :room_id', { 'room_id': roomId })
            .getMany();
    }

    public async getAllUsersInRoom(roomId: number): Promise<UserRoomEntity[]> {
        const userList: UserRoomEntity[] = await this.userRoomRepository.find({
            select: { userId: true },
            relations: {
                room: true,
                user: true,
            },
            where: { roomId: roomId },
        });

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

        const userRooms: UserRoomEntity[] = await this.userRoomRepository.find({
            relations: { room: true },
            where:     { userId: userId },
        });

        for (let userRoom of userRooms) {
            rooms.push(userRoom.room);
        }
        return rooms;
    }

    public async create(dto: CreateUserRoomDto | CreatePrivateUserRoomDto): Promise<UserRoomEntity> {        
        return await this.userRoomRepository.save(new UserRoomEntity(dto));
    }

    public async remove(userRoom: UserRoomEntity): Promise<void> {
        const { id, room, userId: user_id } = userRoom;
        const { id: room_id, ownerId: owner_id } = room;
        const users_len: number = (await this.getAllUsersInRoom(room_id)).length;

        if (owner_id === user_id && users_len > 1) {
            await this.roomService.updateRoomOwner(owner_id, room_id);
        }
        await this.userRoomRepository.delete(id);
        if (await this.roomRolesService.isRole('official', room_id) === true) {
            return null;
        }
        if (users_len == 1) {
            await this.roomService.removeRoom(room);
            return null;
        }
    }

    public async validateUserPassword(dto: CreateUserRoomDto | CreatePrivateUserRoomDto): Promise<boolean> {
        const { roomId: room_id } = dto; 

        if ((await this.roomRolesService.isRole('private', room_id)) === true) {
            if (dto instanceof CreatePrivateUserRoomDto) {
                const { password } = dto;
                
                return await this.roomRolesService.validatePassword(password, room_id);
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}
