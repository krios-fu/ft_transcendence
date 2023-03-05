import { Injectable, BadRequestException } from "@nestjs/common";
import { RoomEntity } from "./entity/room.entity";
import { CreateRoomDto, UpdateRoomDto, UpdateRoomOwnerDto } from "./dto/room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomRepository } from "./repository/room.repository";
import { UpdateResult, DataSource } from "typeorm";
import { RoomQueryDto } from "./dto/room.query.dto";
import { QueryMapper } from "src/common/mappers/query.mapper";
import { UserEntity } from "src/user/entities/user.entity";
import * as fs from 'fs';
import { UserService } from "src/user/services/user.service";
import {UserRoomEntity} from "../user_room/entity/user_room.entity";


@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: RoomRepository,
        private readonly userService: UserService,
        private readonly dataSource: DataSource
    ) { }

    public async findAllRooms(queryParams: RoomQueryDto): Promise<RoomEntity[]> {
        if (queryParams !== undefined) {
            return await this.roomRepository.find(new QueryMapper(queryParams));
        }
        return await this.roomRepository.find();
    }

    public async findOne(roomId: number): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: { id: roomId },
        });
    }

    public async findByName(roomName: string): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: { roomName: roomName }
        });
    }

    public async findRoomOwner(roomId: number): Promise<UserEntity> {
        const room: RoomEntity = await this.findOne(roomId);

        if (room == null) {
            return null;
        }
        return room.owner;
    }

    public async updateRoom(roomId: number, dto: UpdateRoomDto | UpdateRoomOwnerDto): Promise<UpdateResult> {
        return await this.roomRepository.update(roomId, dto);
    }

    public async createRoom(dto: CreateRoomDto): Promise<RoomEntity> {
        const roomEntity: RoomEntity = new RoomEntity(dto);
        const room: RoomEntity | null = await this.roomRepository.save(roomEntity);

        if (room === null) {
            return room;
        }
        const { ownerId, id } = room;
        const userRoom: UserRoomEntity = new UserRoomEntity({ userId: ownerId, roomId: id });

        console.log('user room debuga; ', userRoom);
        room.userRoom = [userRoom];
        console.log('room debuga: ', room);
        const room_two =  await this.roomRepository.save(room);
        console.log('room debuga 2: ', room_two );
        return room_two;
    }

    public async removeRoom(room: RoomEntity): Promise<void> {
        const { id, photoUrl } = room;
        if (photoUrl !== null) {
            fs.unlinkSync(photoUrl);
        }
        await this.roomRepository.delete(id);
    }

    public async findOneRoomByName(name: string): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: { roomName: name }
        });
    }

    public async removeRoomAvatar(roomId: number, photoUrl: string): Promise<UpdateResult> {
        fs.unlinkSync(photoUrl);
        return await this.updateRoom(roomId, { photoUrl: photoUrl });
    }

    public async getRoomsOwnedByUser(userId: number): Promise<RoomEntity[]> {
        return (await this.roomRepository.createQueryBuilder('room'))
            .leftJoinAndSelect(
                'room.owner',
                'user',
                'room.owner_id = :user_id',
                { 'user_id': userId }
            )
            .getMany();
    }

    public async updateRoomOwner(roomId: number): Promise<void | UpdateResult> {
        const users: UserEntity[] = await this.userService.getAdminsInRoom(roomId);

        if (users.length === 0) {
            throw new BadRequestException('owner must chose and administrator first');
        }
        const newOwnerId: number = users[0].id;
        return this.updateRoom(roomId, { ownerId: newOwnerId });
    }

    public async isUserInRoom(userId: number, roomId: number): Promise<boolean> {
        const room: RoomEntity = await (this.roomRepository.createQueryBuilder('room'))
            .leftJoinAndSelect(
                'room.userRoom',
                'user_room',
                'user_room.user_id = :user_id',
                { 'user_id': userId }
            )
            .where('id = :room_id', { 'room_id': roomId })
            .getOne();
            return (room !== null);
    }

    public async validateAdmin(userId: number, roomId: number): Promise<boolean> {
        const admins: UserEntity[] = await this.userService.getAdminsInRoom(roomId);

        console.log('debuga: ', admins);
        return (admins.filter(user => user['id'] == userId)).length > 0;
    }

    ///**************** room auth services *****************/
    //public async loginToRoom(loginInfo: LoginInfoDto): Promise<boolean> {
    //    const roomEntity = await this.roomRepository.findOne({
    //        where: {
    //            name: loginInfo.name
    //        }
    //    });
//
    //    if (roomEntity === null) {
    //        throw new HttpException('Room does not exist in db', HttpStatus.BAD_REQUEST);
    //    }
    //    if (roomEntity.password === null) {
    //        return true;
    //    }
    //    if (loginInfo.password === undefined) {
    //        return false;
    //    }
    //    return await bcrypt.compare(loginInfo.password, roomEntity.password);
    //}
//
    //public async isOwner(loginInfo: LoginInfoDto): Promise<boolean> {
    //    const ownerRoom: RoomEntity = await this.roomRepository.findOne({
    //        relations: { owner: true },
    //        where: { 
    //            name: loginInfo.name,
    //            owner: loginInfo.user, /* ??? */
    //        }
    //    });
//
    //    return (ownerRoom != null);
    //}
//
    //public async getUserRole(user: string, room: string): Promise<Roles> {
    //    const roleArray = await this.rolesRepository.find({
    //        select: ["role"],
    //        where: {
    //            role_user: user,
    //            role_room: room,
    //        }
    //    });
    //    if (roleArray.length === 0) {
    //        return Roles.NOT_IN_ROOM;
    //    }
    //    return roleArray[0].role;
    //}
//
    //public async authRole(userRoleCreds: RoleInfoDto, allowedRole: Roles): Promise<boolean> {
    //    const { user, room } = userRoleCreds;
//
    //    if (user === undefined || room === undefined) { // ???
    //        return false;
    //    }
    //    const userRole = await this.getUserRole(user, room);
//
    //    return (userRole >= allowedRole);
    //}
    /**************** ****************** *****************/
}