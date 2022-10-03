import { IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class CreateRoleDto { 
    @IsString() role: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) { }