import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { RolesEntity } from "./entities/roles.entity";
import { RolesRepository } from "./repositories/roles.repository";
import { RoomEntity } from "./entities/room.entity";
import { RoomMapper } from "./room.mapper";
import { RoomRepository } from "./repositories/room.repository";
import { IRoomLogin } from "./room-login.interface";
import { RoomDto } from "./dto/room.dto";
import * as bcrypt from "bcrypt";
import { Roles } from "./roles.enum";
import { RoleInfoDto } from "./dto/role-info.dto";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private roomRepository: RoomRepository,
        @InjectRepository(RolesEntity)
        private rolesRepository: RolesRepository,
        private roomMapper: RoomMapper,
        private userService: UserService
    ) { }

    async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomRepository.find();
    }

    async findOne(name: string): Promise<RoomEntity> {
        /*const test = this.roomRepository.find({

        })*/

        return await this.roomRepository.findOne(name);
    }

    async joinRoom(roomLogin: IRoomLogin): Promise<RoomEntity> {
        const { name, userName } = roomLogin;
        const roomEntity = await this.roomRepository.findOne({ "name": name });
        const userEntity = await this.userService.findOne(userName);

        if (roomEntity === undefined) {
            throw new HttpException('Room does not exist in db', HttpStatus.BAD_REQUEST);
        }
        const newRole = new RolesEntity(
            userEntity,
            roomEntity
        );
        await this.rolesRepository.save(newRole);
        return roomEntity;
    }

    async createRoom(roomLogin: IRoomLogin): Promise<RoomEntity> {
        const { userName, ...roomDto } = roomLogin;
        const ownerEntity = await this.userService.findOne(userName);

        if (ownerEntity === undefined) {
            throw new HttpException('User currently not in db', HttpStatus.UNAUTHORIZED);
        }
        const roomEntity = this.roomMapper.toEntity(roomDto, ownerEntity);
        const roomInDb = await this.roomRepository.findOne(roomEntity.name);
        
        if (roomInDb != undefined) {
            throw new HttpException('Room already in db', HttpStatus.BAD_REQUEST);
        }
        await this.roomRepository.save(roomEntity);
        return roomEntity;
    }

    async loginToRoom(roomCredentials: RoomDto): Promise<boolean> {
        const roomEntity = await this.roomRepository.findOne(roomCredentials.name);

        if (roomEntity === undefined) {
            throw new HttpException('Room does not exist in db', HttpStatus.BAD_REQUEST);
        }
        if (roomEntity.password === null) {
            return true;
        }
        if (roomCredentials.password === undefined) {
            return false;
        }
        return await bcrypt.compare(roomCredentials.password, roomEntity.password);
    }

    async authRole(userRoleCreds: RoleInfoDto, allowedRole: Roles): Promise<boolean> {
        const { user, room } = userRoleCreds;
        const userRole = await this.getUserRole(user, room);

        return (allowedRole === userRole);
    }

    async getUserRole(user: string, room: string): Promise<Roles> {
        const role = await this.rolesRepository.find({
            select: ["role"],
            where: {
                role_user: user,
                role_room: room,
            }
        });
        console.log('query auth: ' + role);
        //return role;
        return Roles.User;
    }
}