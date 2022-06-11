import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/user/user.entity";
import { RoomDto } from "./dto/room.dto";
import { RoomEntity } from "./entities/room.entity";

@Injectable()
export class RoomMapper {
    toDto(roomEntity: RoomEntity): RoomDto {
        const { name, password } = roomEntity;

        return {
            "name": name,
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