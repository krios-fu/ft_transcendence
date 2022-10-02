import { IsString } from "class-validator";

export class RoomRolesDto {
    @IsString() readonly room: string;
    @IsString() readonly role: string;
}