import { IsNotEmpty, 
    IsString,
    IsNumber } from "class-validator";
import { ChatMessageEntity } from "../entities/chat-message.entity";

export class ChatDto {
    id?: number;
    begin_at: Date;
    messages?: ChatMessageEntity[];
}


export class chatPayload {
    @IsNumber()
    @IsNotEmpty()
    friendId: number;
}

export class CreateChatUserDto {
    @IsNumber()
    @IsNotEmpty()
    chatId: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;
}

export class CreateChatMessageDto {
    @IsString()
    @IsNotEmpty()
    content : string;

    @IsNumber()
    @IsNotEmpty()
    chatUserId: number;
}