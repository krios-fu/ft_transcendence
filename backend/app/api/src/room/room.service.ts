import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { RolesEntity } from "./entities/roles.entity";
import { RolesRepository } from "./repositories/roles.repository";
import { RoomEntity } from "./entities/room.entity";
import { RoomMapper } from "./room.mapper";
import { RoomRepository } from "./repositories/room.repository";
import { RoomLogin } from "./room-login.interface";
import { RoomDto } from "./room.dto";
import * as bcrypt from "bcrypt";

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

    async joinRoom(roomLogin: RoomLogin): Promise<RoomEntity> {
        const { name, userName } = roomLogin;
        const roomEntity = await this.roomRepository.findOne({ "roomName": name });
        const userEntity = await this.userService.findOne(userName);

        console.log(roomEntity);
        if (roomEntity === undefined) {
            throw new HttpException('Room does not exist in db', HttpStatus.BAD_REQUEST);
        }
        const newRole = new RolesEntity(
            userEntity,
            roomEntity
        );
        console.log(newRole);
        await this.rolesRepository.save(newRole);
        return roomEntity;
    }

    async createRoom(roomLogin: RoomLogin): Promise<RoomEntity> {
        const { userName, ...roomDto } = roomLogin;
        const ownerEntity = await this.userService.findOne(userName);

        if (ownerEntity === undefined) {
            throw new HttpException('User currently not in db', HttpStatus.UNAUTHORIZED);
        }
        const roomEntity = this.roomMapper.toEntity(roomDto, ownerEntity);
        const roomInDb = await this.roomRepository.findOne(roomEntity.roomName);
        
        if (roomInDb != undefined) {
            throw new HttpException('Room already in db', HttpStatus.BAD_REQUEST);
        }
        console.log(roomEntity);
        await this.roomRepository.save(roomEntity);
        return roomEntity;
    }

    async loginToRoom(roomCredentials: RoomDto): Promise<boolean> {
        const roomEntity = await this.roomRepository.findOne(roomCredentials.name);

        if (roomEntity === undefined) {
            throw new HttpException('Room does not exist in db', HttpStatus.BAD_REQUEST);
        }
        if (roomEntity.password === undefined) {
            return true;
        }
        return await bcrypt.compare(roomEntity.password, roomEntity.password);
    }
}