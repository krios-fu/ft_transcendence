import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserRoomRolesDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    roomId: number;

    @IsNotEmpty()
    @IsNumber() 
    @Type(() => Number)
    roleId: number;
}

export class UpdateUserRoomRolesDto extends PartialType(CreateUserRoomRolesDto) { }

export class UserRoomRolesDto {
    constructor(dto?: { "userRoomId": number, "roleId": number }) {
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    userRoomId: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    roleId: number;
}