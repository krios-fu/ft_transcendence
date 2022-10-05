import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateUserRolesDto {
    @IsString() userId: string;
    @IsString() roleId: string;
}

export class UpdateUserRolesDto extends PartialType(CreateUserRolesDto) { }