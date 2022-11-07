import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserRolesDto {
    @IsNotEmpty()
    @IsNumber() 
    @Type(() => Number)
    userId: number;

    @IsNotEmpty()
    @IsNumber() 
    @Type(() => Number)
    roleId: number;
}

export class UpdateUserRolesDto extends PartialType(CreateUserRolesDto) { }