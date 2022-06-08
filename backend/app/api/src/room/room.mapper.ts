import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/user/user.entity";
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

    toEntity(roomDto: RoomDto, owner: UserEntity): RoomEntity {
        const { roomName, password } = roomDto;
        const roomEntity = new RoomEntity (
            roomName,
            owner,
            password,
        );

        return roomEntity;
    }
}