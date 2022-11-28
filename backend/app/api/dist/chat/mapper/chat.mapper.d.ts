import { ChatDto } from "../dtos/chat.dto";
import { ChatEntity } from "../entities/chat.entity";
export declare class ChatMapper {
    toEntity(chatDto: ChatDto): ChatEntity;
    toDto(chatEntity: ChatEntity): ChatDto;
}
