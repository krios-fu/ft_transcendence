import { IsString } from "class-validator";

export class RoomDto {

    @IsString()
    roomName: string;

    @IsString()
    password?: string;
};
