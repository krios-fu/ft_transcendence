import { IsString } from "class-validator";

export class RoomDto {

    @IsString()
    name: string;

    @IsString()
    password?: string;
};
