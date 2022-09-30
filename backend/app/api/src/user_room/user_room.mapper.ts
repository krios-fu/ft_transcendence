import { Injectable } from "@nestjs/common";
import { UsersRoomDto } from "./dto/user_room.dto";
import { UsersRoomEntity } from "./entity/user_room.entity";

@Injectable()
export class UsersRoomMapper {
    toEntity(usersRoomDto: UsersRoomDto): UsersRoomEntity {
        return new UsersRoomEntity(
            usersRoomDto.room_id, 
            usersRoomDto.user_id
            );
    }

    toDto(usersRoomEntity: UsersRoomEntity): UsersRoomDto {
        return {
            user_id: usersRoomEntity.user_id,
            room_id: usersRoomEntity.room_id,
        };
    }
}