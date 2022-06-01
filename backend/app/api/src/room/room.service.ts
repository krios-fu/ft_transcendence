import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomDto } from './room.dto';
import { RoomEntity } from './room.entity';

@Injectable()
export class RoomService {
    constructor (
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
    ) {}


    async createRoom(room: RoomDto) {
        const roomEntity = new RoomEntity();

        roomEntity.roomName = room.roomName;
//        roomEntity.date = room.date;
        return await this.roomRepository.save(room); 
    }
}
