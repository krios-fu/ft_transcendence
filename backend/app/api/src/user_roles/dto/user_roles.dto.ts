import { PartialType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";

export class CreateUserRolesDto {
    @IsNumber() userId: number;
    @IsNumber() roleId: number;
}

export class UpdateUserRolesDto extends PartialType(CreateUserRolesDto) { }