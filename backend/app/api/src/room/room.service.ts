import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RoomEntity } from "./entity/room.entity";
import { CreateRoomDto } from "./dto/room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomRepository } from "./repository/room.repository";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: RoomRepository,
        private readonly userService: UserService,
    ) { }

    public async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomRepository.find();
    }

    public async findOne(roomId: string): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: { roomId: roomId }
        });
    }

    public async getRoomOwner(roomId: string): Promise<UserEntity> {
        const room = this.findOne(roomId);
        if (room === null) {
            throw new HttpException('no room in db', HttpStatus.BAD_REQUEST);
        }
        return (await room).owner;
    }

    public async updateRoomOwner(roomId: string, new_owner_id: string): Promise<RoomEntity> {
        const room = await this.findOne(roomId);
        if (room === null) {
            throw new HttpException('no room in db', HttpStatus.BAD_REQUEST);
        }
        const newOwner = await this.userService.findOne(new_owner_id);
        if (newOwner === null) {
            throw new HttpException('no user in db', HttpStatus.BAD_REQUEST);
        }
        return await this.roomRepository.preload({
            roomId: room.roomId,
            owner: newOwner,
        });
    }

    public async createRoom(dto: CreateRoomDto): Promise<RoomEntity> {
        const { roomId, password, owner } = dto;
        const ownerEnt = await this.userService.findOne(owner);
        if (ownerEnt === undefined) {
            throw new HttpException('no user in db', HttpStatus.UNAUTHORIZED);
        }
        const newRoom = new RoomEntity(dto);
        const roomInDb = await this.roomRepository.findOne({ 
            where: { roomId: roomId }
        });
        if (roomInDb != undefined) {
            throw new HttpException('room already in db', HttpStatus.BAD_REQUEST);
        }
        return await this.roomRepository.save(newRoom);
    }

    public async removeRoom(roomId: string): Promise<void> {
        await this.roomRepository.delete(roomId);
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