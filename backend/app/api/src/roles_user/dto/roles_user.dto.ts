import { IsString } from "class-validator";

export class RolesUserDto {
    @IsString()
    user_id: string;

    @IsString()
    role_id: string;
}