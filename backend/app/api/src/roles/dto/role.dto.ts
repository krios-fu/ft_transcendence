import { IsString } from "class-validator";

export class RoleDto { 
    @IsString()
    role: string;
}
