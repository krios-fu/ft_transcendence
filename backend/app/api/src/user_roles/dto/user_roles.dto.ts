import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateRolesUserDto {
    @IsString() user_id: string;
    @IsString() role_id: string;
}

export class UpdateRolesUserDto extends PartialType(CreateRolesUserDto) { }