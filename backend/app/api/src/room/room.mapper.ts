import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/user/user.entity";
import { RoomDto } from "./room.dto";
import { RoomEntity } from "./entities/room.entity";

@Injectable()
export class RoomMapper {
    toDto(roomEntity: RoomEntity): RoomDto {
        const { roomName, password } = roomEntity;

        return {
            "name": roomName,
            "password": password
        };
    }

    toEntity(roomDto: RoomDto, owner: UserEntity): RoomEntity {
        const { name, password } = roomDto;
        const roomEntity = new RoomEntity (
            name,
            owner,
            password,
        );

        return roomEntity;
    }
}