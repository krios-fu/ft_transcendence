import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateChatUserDto {
    @IsNumber()
    @IsNotEmpty()
    chatId: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;
}