import { Injectable } from "@nestjs/common";
import { UsersRoomDto } from "./dto/users_room.dto";
import { UsersRoomEntity } from "./entities/users_room.entity";

@Injectable()
export class UsersRoomMapper {
    toEntity(usersRoomDto: UsersRoomDto): UsersRoomEntity {

    }

    toDto(UsersRoomEntity: UsersRoomEntity): UsersRoomDto {
        
    }
}