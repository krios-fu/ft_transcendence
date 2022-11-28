import { IsNotEmpty, IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class CreateRoleDto { 
    @IsNotEmpty()
    @IsString() 
    role: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) { }