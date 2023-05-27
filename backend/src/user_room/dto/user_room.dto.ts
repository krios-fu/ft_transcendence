import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserRoomDto {
    @IsNotEmpty()
    @IsNumber() 
    @Type(() => Number)
    roomId: number;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    /* password validation */
    password?: string;
}

export class UserRoomDto {
    userId: number;
    roomId: number;
}

export class UpdateUserRoomDto extends PartialType(CreateUserRoomDto) { }
