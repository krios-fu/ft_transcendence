import { IsOptional, IsString } from "class-validator";

export class RoomDto {

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    password?: string;
};