import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRoomRolesDto {
    @IsNumber() 
    readonly roomId: number;

    @IsNumber() 
    readonly roleId: number;

    @IsOptional()
    @IsString()
    password?: string;
}

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
