import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateUserRoomDto {
    @IsString() user_id: string;
    @IsString() room_id: string;
}

export class UpdateUserRoomDto extends PartialType(CreateUserRoomDto) { }
