import { UserEntity } from "src/user/user.entity";
import { RoomDto } from "./dto/room.dto";
import { RoomEntity } from "./entities/room.entity";
export declare class RoomMapper {
    toDto(roomEntity: RoomEntity): RoomDto;
    toEntity(roomDto: RoomDto, owner: UserEntity): RoomEntity;
}
