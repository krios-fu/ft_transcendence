import { IsString } from "class-validator";

export class RoomMsgDto {
    @IsString()
    room: string;

    @IsString()
    message: string;
}
