import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserRoomRolesDto {
    @IsNotEmpty()
    @IsNumber() 
    userRoomId: number;

    @IsNotEmpty()
    @IsNumber() 
    roleId: number;
}

export class UpdateUserRoomRolesDto extends PartialType(CreateUserRoomRolesDto) { }