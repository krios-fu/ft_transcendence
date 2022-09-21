import { IsString } from "class-validator";

export class RolesRoomDto {
    @IsString()
    role_id: string;

    @IsString()
    room_id: string;
}