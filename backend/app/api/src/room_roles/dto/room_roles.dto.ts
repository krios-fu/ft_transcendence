import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateRoomRolesDto {
    @IsString() readonly roomId: string;
    @IsString() readonly roleId: string;
    /* aqui contrasenia */
}

export class UpdateRoomRolesDto extends PartialType(CreateRoomRolesDto) { }