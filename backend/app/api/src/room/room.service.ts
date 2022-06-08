import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomDto } from "./room.dto";
import { RoomEntity } from "./room.entity";
import { RoomRepository } from "./room.repository";
import { UserRepository } from "../user/user.repository";

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(RoomEntity)
        private roomRepository: RoomRepository,
        private userRepository: UserRepository
    ) { }

    async getAllRooms(): Promise<RoomEntity[]> {
        return await this.roomRepository.find();
    }

    async joinRoom(roomName: string): Promise<RoomEntity> {
        return await this.roomRepository.findOne({"roomName": roomName});
    }

    async createRoom(roomDto: RoomDto): Promise<RoomDto> {

        const roomEntity = 
    }
}