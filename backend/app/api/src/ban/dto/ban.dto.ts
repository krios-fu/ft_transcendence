import { IsString } from "class-validator";

export class BanDto {
    @IsString()
    user_id: string;

    @IsString()
    room_id: string;
}