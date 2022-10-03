import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateUserRolesDto {
    @IsString() user_id: string;
    @IsString() role_id: string;
}

export class UpdateUserRolesDto extends PartialType(CreateUserRolesDto) { }