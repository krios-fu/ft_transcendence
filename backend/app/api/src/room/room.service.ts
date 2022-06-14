import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { RolesEntity } from "./entities/roles.entity";
import { RolesRepository } from "./repositories/roles.repository";
import { RoomEntity } from "./entities/room.entity";
import { RoomMapper } from "./room.mapper";
import { RoomRepository } from "./repositories/room.repository";
import { RoomDto } from "./dto/room.dto";
import * as bcrypt from "bcrypt";
import { Roles } from "./roles.enum";
import { RoleInfoDto } from "./dto/role-info.dto";
import { LoginInfoDto } from "./dto/login-info.dto";

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

        return await this.roomRepository.findOne({
            where: {
                name: name,
            }
        });
    }

    async joinRoom(roomLogin: LoginInfoDto): Promise<RoomEntity> {
        const { name, user } = roomLogin;
        const roomEntity = await this.roomRepository.findOne({ 
            where: {
                name: name,
            }
        });
        const userEntity = await this.userService.findOne(user);

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
            where: { 
                name: roomEntity.name 
            }
        });
        
        if (roomInDb != undefined) {
            throw new HttpException('Room already in db', HttpStatus.BAD_REQUEST);
        }
        await this.roomRepository.save(roomEntity);
        return roomEntity;
    }

    async loginToRoom(loginInfo: LoginInfoDto): Promise<boolean> {
        const roomEntity = await this.roomRepository.findOne({
            where: {
                name: loginInfo.name
            }
        });

        if (roomEntity === undefined) {
            throw new HttpException('Room does not exist in db', HttpStatus.BAD_REQUEST);
        }
        if (roomEntity.password === null) {
            return true;
        }
        if (loginInfo.password === undefined) {
            return false;
        }
        return await bcrypt.compare(loginInfo.password, roomEntity.password);
    }

    async getUserRole(user: string, room: string): Promise<Roles> {
        const roleArray = await this.rolesRepository.find({
            select: ["role"],
            where: {
                role_user: user,
                role_room: room,
            }
        });
        if (roleArray.length === 0) {
            return Roles.NOT_IN_ROOM;
        }
        return roleArray[0].role;
    }

    async authRole(userRoleCreds: RoleInfoDto, allowedRole: Roles): Promise<boolean> {
        const { user, room } = userRoleCreds;

        if (user === undefined || room === undefined) { // ???
            return false;
        }
        const userRole = await this.getUserRole(user, room);

        return (userRole >= allowedRole);
    }
}