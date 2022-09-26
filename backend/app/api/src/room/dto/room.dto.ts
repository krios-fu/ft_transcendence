import { IsString } from "class-validator";

export class RoomDto {
    @IsString()
    room_id: string;

    @IsString()
    owner: string;

    @IsString()
    password?: string;
}