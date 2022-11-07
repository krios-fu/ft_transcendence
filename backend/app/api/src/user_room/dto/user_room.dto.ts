import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserRoomDto {
    @IsNotEmpty()
    @IsNumber() 
    userId: number;

    @IsNotEmpty()
    @IsNumber() 
    roomId: number;
}

export class UpdateUserRoomDto extends PartialType(CreateUserRoomDto) { }
