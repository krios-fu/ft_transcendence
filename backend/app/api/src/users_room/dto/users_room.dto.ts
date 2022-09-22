import { IsString } from "class-validator";

export class UsersRoomDto {
    @IsString()
    user_id: string;

    @IsString()
    room_id: string;
}
