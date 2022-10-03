import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateRoomRolesDto {
    @IsString() readonly room: string;
    @IsString() readonly role: string;
}

export class UpdateRoomRolesDto extends PartialType(CreateRoomRolesDto) { }