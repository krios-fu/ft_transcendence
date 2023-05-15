import {IsNotEmpty, IsString, Length} from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class CreateRoleDto {
    @IsNotEmpty()
    @Length(1, 15)
    @IsString()
    role: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) { }