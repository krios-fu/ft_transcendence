import { ChatService } from "./chat.service";
import { ChatEntity } from "./entities/chat.entity";
import { ChatDto } from "./dtos/chat.dto";
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    findAll(): Promise<ChatEntity[]>;
    findChat(id: number): Promise<ChatEntity[]>;
    newChat(newChat: ChatDto): Promise<ChatEntity>;
}
