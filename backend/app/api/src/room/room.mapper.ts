import { Injectable } from "@nestjs/common";
import { RoomDto } from "./room.dto";
import { RoomEntity } from "./room.entity";

@Injectable()
export class RoomMapper {
    toDto(roomEntity: RoomEntity): RoomDto {
        const { roomName, password } = roomEntity;

        return {
            "roomName": roomName,
            "password": password
        };
    }

    toEntity(roomDto: RoomDto, owner: string): RoomEntity {
        const { roomName, password } = roomDto;
        const roomEntity = new RoomEntity {
            "roomName": roomName,
            "password": password,
            "owner": owner
        };
    }
}