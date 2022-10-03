import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateRoomDto {
    @IsString() room_id: string;
    @IsString() owner: string;
    @IsString() password?: string;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) { }