import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Length, Matches } from "class-validator";

export class CreateRoomDto {
    @IsString()
    @Length(1, 15)
    @IsNotEmpty()
    @Matches(/^\w+$/)
    roomName: string;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    ownerId: number; // bad
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

export class CreateRoomMessageDto {
    @IsNumber()
    @IsNotEmpty()
    userRoomId: number;

    @IsString()
    @IsNotEmpty()
    content: string;
}
