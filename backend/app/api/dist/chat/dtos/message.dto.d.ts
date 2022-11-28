import { UserDto } from "../../user/user.dto";
import { ChatDto } from "./chat.dto";
export declare class MessageDto {
    id: number;
    content: string;
    author: UserDto;
    chat: ChatDto;
}
