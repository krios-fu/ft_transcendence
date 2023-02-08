import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoomDto {
    @IsString()       
    @IsNotEmpty()
    roomName: string;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    ownerId: number; // bad
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) { 
    @IsString()
    @IsNotEmpty()
    photoUrl?: string;
}

export class RoomMsgDto {
    @IsString() room: string;
    @IsString() message: string;
}