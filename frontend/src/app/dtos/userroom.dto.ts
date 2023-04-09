import { RoomDto } from "./room.dto";
import { UserDto } from "./user.dto";

export class UserRoomDto {
    constructor(
        userId: number,
        roomId: number,
        user: UserDto,
        room: RoomDto
    ) {
        this.userId = userId;
        this.roomId = roomId;
        this.user = user;
        this.room = room;
    }
    userId: number;
    roomId: number;
    user: UserDto;
    room: RoomDto;
}