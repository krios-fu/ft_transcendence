import { IsNumber, IsString } from "class-validator";

export class RolesRoomDto {
    @IsNumber()
    user_room_id: number;

    @IsString()
    role_id: string;
}