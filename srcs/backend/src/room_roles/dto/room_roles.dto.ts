import {IsNotEmpty, 
    IsNumber, 
    IsOptional, 
    IsString,
    Length,
    Matches} from "class-validator";
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

    @IsString()
    @Length(8, 15)
    @IsNotEmpty()
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])/)
    @IsOptional()
    password?: string;
}

export class UpdatePasswordDto {
    @IsString()
    @Length(8, 15)
    @IsNotEmpty()
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])/)
    oldPassword: string;

    @IsString()
    @Length(8, 15)
    @IsNotEmpty()
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])/)
    newPassword: string;
}
