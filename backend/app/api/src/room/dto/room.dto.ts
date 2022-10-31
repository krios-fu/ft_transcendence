import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsString } from "class-validator";

export class CreateRoomDto {
    @IsString() roomName: string;
    @IsNumber() ownerId: number;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) { }