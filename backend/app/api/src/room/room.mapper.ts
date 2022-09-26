import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/user/user.entity";
import { RoomDto } from "./dto/room.dto";
import { RoomEntity } from "./entities/room.entity";

@Injectable()
export class RoomMapper {
    toDto(roomEntity: RoomEntity): RoomDto {
        const { room_id, password } = roomEntity;
        const owner = roomEntity.owner.username;

        return {
            "room_id": room_id,
            "owner": owner,
            "password": password
        };
    }

    toEntity(roomDto: RoomDto, owner: UserEntity): RoomEntity {
        const { room_id, password } = roomDto;
        const roomEntity = new RoomEntity (
            room_id,
            owner,
            password,
        );

        return roomEntity;
    }
}