import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RoomEntity } from "./entities/room.entity";
import { RoomDto } from "./dto/room.dto";
import * as bcrypt from "bcrypt";
import { RoleInfoDto } from "./dto/role-info.dto";
import { LoginInfoDto } from "./dto/login-info.dto";
import { Not } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { RolesEntity } from "src/roles/entities/roles.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomRepository } from "./repositories/room.repository";
import { UserService } from "src/user/user.service";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: RoomRepository,
        private readonly userService: UserService,
    ) { }

    async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomRepository.find();
    }

    async findOne(name: string): Promise<RoomEntity> {
        return await this.roomRepository.findOne({
            where: { name: name }
        });
    }

    async joinRoom(roomLogin: LoginInfoDto): Promise<RoomEntity> { /* */
        
    }

    async createRoom(roomLogin: LoginInfoDto): Promise<RoomEntity> {
        const { name, password, user } = roomLogin;
        const roomDto: RoomDto = {
            name: name,
            password: password,
        };
        const ownerEntity = await this.userService.findOne(user);

        if (ownerEntity === undefined) {
            throw new HttpException('User currently not in db', HttpStatus.UNAUTHORIZED);
        }
        const roomEntity = this.roomMapper.toEntity(roomDto, ownerEntity);
        const roomInDb = await this.roomRepository.findOne({ 
            where: { name: name }
        });
        
        if (roomInDb != undefined) {
            throw new HttpException('Room already in db', HttpStatus.BAD_REQUEST);
        }
        await this.roomRepository.save(roomEntity);
        return roomEntity;
    }

    async getRoomUsers(roomName: string): Promise<UserEntity[]> { /* */
    }

    async removeRoom(room_id: string): Promise<void> {
        await this.roomRepository.remove(room_id);
        return 
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