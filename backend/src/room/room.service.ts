import { Injectable, NotFoundException } from "@nestjs/common";
import { RoomEntity } from "./entity/room.entity";
import { CreateRoomDto, UpdateRoomDto, UpdateRoomOwnerDto } from "./dto/room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomRepository } from "./repository/room.repository";
import { UpdateResult } from "typeorm";
import { RoomQueryDto } from "./dto/room.query.dto";
import { QueryMapper } from "src/common/mappers/query.mapper";
import { UserEntity } from "src/user/entities/user.entity";
import * as fs from 'fs';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: RoomRepository,
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

    public async findRoomOwner(roomId: number): Promise<UserEntity> {
        const room = this.findOne(roomId);
        return (await room).owner;
    }

    public async updateRoom(roomId: number, dto: UpdateRoomDto | UpdateRoomOwnerDto): Promise<UpdateResult> {
        return await this.roomRepository.update(roomId, dto);
    }

    public async createRoom(dto: CreateRoomDto): Promise<RoomEntity> {
        return await this.roomRepository.save(new RoomEntity(dto));
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