import { IsOptional, IsString, MinLength } from "class-validator";

export class RoomDto {

    @IsString()
    name: string;

    @IsString()
    @MinLength(8, {
        message: 'Password is too short (min. 8 characters)',
    })
    @IsOptional()
    password?: string;
};