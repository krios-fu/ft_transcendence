import { IsString } from "class-validator";

export class RoleInfoDto {
    @IsString()
    user: string;

    @IsString()
    room: string;
}
