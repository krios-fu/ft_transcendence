import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RoomEntity } from "./entities/room.entity";
import { RoomDto } from "./dto/room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomRepository } from "./repositories/room.repository";
import { UserService } from "src/user/user.service";
import { RoomMapper } from "./room.mapper";
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: RoomRepository,
        private readonly userService: UserService,
        private readonly roomMapper: RoomMapper,
    ) { }

    async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomRepository.find();
    }

    async findOne(room_id: string): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: { room_id: room_id }
        });
    }

    async getRoomOwner(room_id: string, owner_id: string): Promise<UserEntity> {
        const room = this.findOne(room_id);
        if (room === null) {
            throw new HttpException('no room in db', HttpStatus.BAD_REQUEST);
        }
        return (await room).owner;
    }

    async updateRoomOwner(room_id: string, new_owner_id: string): Promise<RoomEntity> {
        const room = await this.findOne(room_id);
        if (room === null) {
            throw new HttpException('no room in db', HttpStatus.BAD_REQUEST);
        }
        const newOwner = await this.userService.findOne(new_owner_id);
        if (newOwner === null) {
            throw new HttpException('no user in db', HttpStatus.BAD_REQUEST);
        }
        return await this.roomRepository.preload({
            room_id: room.room_id,
            owner: newOwner,
        });
    }

    async createRoom(dto: RoomDto): Promise<RoomEntity> {
        const { room_id, password, owner } = dto;
        const ownerEnt = await this.userService.findOne(owner);
        if (ownerEnt === undefined) {
            throw new HttpException('no user in db', HttpStatus.UNAUTHORIZED);
        }
        const newRoom = this.roomMapper.toEntity(dto, ownerEnt);
        const roomInDb = await this.roomRepository.findOne({ 
            where: { room_id: room_id }
        });
        if (roomInDb != undefined) {
            throw new HttpException('room already in db', HttpStatus.BAD_REQUEST);
        }
        return await this.roomRepository.save(newRoom);
    }

    async removeRoom(room_id: string): Promise<void> {
        await this.roomRepository.delete(room_id);
    }

    ///**************** room auth services *****************/
    //async loginToRoom(loginInfo: LoginInfoDto): Promise<boolean> {
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
    //async isOwner(loginInfo: LoginInfoDto): Promise<boolean> {
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
    //async getUserRole(user: string, room: string): Promise<Roles> {
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
    //async authRole(userRoleCreds: RoleInfoDto, allowedRole: Roles): Promise<boolean> {
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