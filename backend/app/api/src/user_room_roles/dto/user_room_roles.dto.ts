import { PartialType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";

export class CreateUserRoomRolesDto {
    @IsNumber() userRoomId: number;
    @IsNumber() roleId: number;
}

export class UpdateUserRoomRolesDto extends PartialType(CreateUserRoomRolesDto) { }