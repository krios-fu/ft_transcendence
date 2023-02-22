import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoomDto {
    @IsString()       
    @IsNotEmpty()
    roomName: string;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    ownerId: number;
}

export class UpdateRoomDto {
    @IsString()       
    @IsNotEmpty()
    roomName?: string;

    @IsString()
    @IsNotEmpty()
    photoUrl?: string;
}

export class UpdateRoomOwnerDto {
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    ownerId: number;
}

export class RoomMsgDto {
    @IsString() room: string;
    @IsString() message: string;
}