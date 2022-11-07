import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateRoomDto {
    @IsString()       
    @IsNotEmpty()
    roomName: string;

    @IsNumberString()
    @IsNotEmpty()
    ownerId: number;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) { }