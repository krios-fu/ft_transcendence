import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsString } from "class-validator";

export class CreateUserRoomRolesDto {
    @IsNumber() userRoomId: number;
    @IsString() roleId: string;
}

export class UpdateUserRoomRolesDto extends PartialType(CreateUserRoomRolesDto) { }