import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";

export class CreateRoomDto {
    @IsString() 
    roomId: string;

    @IsString() 
    ownerId: string;

    @IsString() 
    @IsOptional()
    password?: string;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) { }