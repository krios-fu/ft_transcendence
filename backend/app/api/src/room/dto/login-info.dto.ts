import { IsString } from "class-validator";
import { RoomDto } from "./room.dto";

export class LoginInfoDto extends RoomDto {
    @IsString()
    user: string;

    @IsString()
    name: string;
}
