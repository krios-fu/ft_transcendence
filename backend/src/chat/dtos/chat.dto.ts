import { IsNotEmpty, IsNumber } from "class-validator";
import {MessageEntity} from "../entities/message.entity";

export class ChatDto {
    id?: number;
    begin_at: Date;
    messages?: MessageEntity[];
}


export class chatPayload {
    @IsNumber()
    @IsNotEmpty()
    friendId: number;
}