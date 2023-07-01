import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateUserRoomDto {
    @IsNotEmpty()
    @IsNumber() 
    @Type(() => Number)
    roomId: number;

    @IsString()
    @Length(8, 15)
    @IsNotEmpty()
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])/)
    @IsOptional()
    password?: string;
}

export class UserRoomDto {
    userId: number;
    roomId: number;
}

export class UpdateUserRoomDto extends PartialType(CreateUserRoomDto) { }
