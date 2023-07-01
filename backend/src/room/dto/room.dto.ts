import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Length, Matches } from "class-validator";

export class CreateRoomDto {
    @IsString()
    @Length(1, 15)
    @IsNotEmpty()
    @Matches(/^\w+$/)
    roomName: string;
}

export class CreatePrivateRoomDto extends CreateRoomDto {
    @IsString()
    @Length(8, 15)
    @IsNotEmpty()
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])/)
    password: string;
}

export class UpdateRoomDto {
    @IsString()       
    @IsNotEmpty()
    roomName?: string;

    @IsString()
    @IsNotEmpty()
    photoUrl?: string;
}

export class UpdateRoomOwnerDto {
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    ownerId: number;
}

export class RoomMsgDto {
    @IsString() room: string;
    @IsString() message: string;
}
