import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserRoomDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    userId: number;

    @IsNotEmpty()
    @IsNumber() 
    @Type(() => Number)
    roomId: number;
}

export class UpdateUserRoomDto extends PartialType(CreateUserRoomDto) { }
