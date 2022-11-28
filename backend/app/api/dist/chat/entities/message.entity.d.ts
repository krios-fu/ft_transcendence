import { UserEntity } from "../../user/user.entity";
import { ChatEntity } from "./chat.entity";
export declare class MessageEntity {
    id: number;
    content: string;
    author: UserEntity;
    chat: ChatEntity;
}
