import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateRoomRolesDto {
    @IsNotEmpty()
    @IsNumber() 
    readonly roomId: number;

    @IsNotEmpty()
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
