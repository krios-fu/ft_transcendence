import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class CreateUserRoomDto {
    @IsString() userId: string;
    @IsString() roomId: string;
}

export class UpdateUserRoomDto extends PartialType(CreateUserRoomDto) { }
