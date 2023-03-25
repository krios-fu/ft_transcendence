import {IsNotEmpty, 
    IsNumber, 
    IsOptional, 
    IsString} from "class-validator";
import { Type } from "class-transformer";

export class CreateRoomRolesDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    readonly roomId: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
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
