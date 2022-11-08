import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserRoomRolesDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    userRoomId: number;

    @IsNotEmpty()
    @IsNumber() 
    @Type(() => Number)
    roleId: number;
}

export class UpdateUserRoomRolesDto extends PartialType(CreateUserRoomRolesDto) { }