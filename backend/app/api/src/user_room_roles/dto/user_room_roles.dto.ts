import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsString } from "class-validator";

export class CreateUserRoomRolesDto {
    @IsNumber() user_room_id: number;
    @IsString() role_id: string;
}

export class UpdateUserRoomRolesDto extends PartialType(CreateUserRoomRolesDto) { }