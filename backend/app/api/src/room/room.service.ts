import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";
import { RolesEntity } from "./roles.entity";
import { RolesRepository } from "./roles.repository";
import { RoomDto } from "./room.dto";
import { RoomEntity } from "./room.entity";
import { RoomMapper } from "./room.mapper";
import { RoomRepository } from "./room.repository";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private roomRepository: RoomRepository,
        private rolesRepository: RolesRepository,
        private roomMapper: RoomMapper,
        private userService: UserService
    ) { }

    async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomRepository.find();
    }

    async joinRoom(username: string, roomName: string): Promise<RoomEntity> {
        const roomEntity = await this.roomRepository.findOne({"roomName": roomName});
        const userEntity = await this.userService.findOne(username);

        if (!Object.keys(roomEntity).length) {
            throw new HttpException('Room does not exist in db', HttpStatus.BAD_REQUEST);
        }
        const newRole = new RolesEntity(
            userEntity,
            roomEntity
        );
        await this.rolesRepository.save(newRole);
        return roomEntity;
    }

    async createRoom(roomDto: RoomDto, username: string): Promise<RoomDto> {
        const ownerEntity = this.userService.findOne(username);

        if (!Object.keys(ownerEntity).length) {
            throw new HttpException('User currently not in db', HttpStatus.UNAUTHORIZED);
        }
        const roomEntity = this.roomMapper.toEntity(roomDto, ownerEntity);
        const roomInDb = this.roomRepository.findOne(roomEntity.roomName);
        
        if (!Object.keys(roomInDb).length) {
            throw new HttpException('Room already in db', HttpStatus.BAD_REQUEST);
        }
        await this.roomRepository.save(roomEntity);
        return roomDto;
    }
}