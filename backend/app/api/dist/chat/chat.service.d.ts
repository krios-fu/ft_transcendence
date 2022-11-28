import { ChatEntity } from "./entities/chat.entity";
import { ChatRepository } from "./repository/chat.repository";
import { ChatDto } from "./dtos/chat.dto";
import { ChatMapper } from "./mapper/chat.mapper";
export declare class ChatService {
    private chatRepository;
    private chatMapper;
    constructor(chatRepository: ChatRepository, chatMapper: ChatMapper);
    findChats(): Promise<ChatEntity[]>;
    findOne(id_chat: number): Promise<ChatEntity[]>;
    findChatsUser(id_user: string): Promise<ChatEntity[]>;
    findChatUser(id_user: string, id_friend: string): Promise<ChatEntity[]>;
    post(chat: ChatDto): Promise<ChatEntity>;
}
