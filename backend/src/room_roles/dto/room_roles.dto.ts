import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRoomRolesDto {
    @IsNumber() 
    readonly roomId: number;

    @IsNumber() 
    readonly roleId: number;

    @IsOptional()
    @IsString()
    password?: string;
}

export class UpdateRoomRolesDto extends PartialType(CreateRoomRolesDto) { }
