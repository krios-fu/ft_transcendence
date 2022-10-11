import { PartialType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";

export class CreateUserRoomDto {
    @IsNumber() userId: number;
    @IsNumber() roomId: number;
}

export class UpdateUserRoomDto extends PartialType(CreateUserRoomDto) { }
