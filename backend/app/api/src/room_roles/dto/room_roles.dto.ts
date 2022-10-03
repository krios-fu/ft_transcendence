import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateRoomRolesDto {
    @IsString() readonly room_id: string;
    @IsString() readonly role_id: string;
}

export class UpdateRoomRolesDto extends PartialType(CreateRoomRolesDto) { }