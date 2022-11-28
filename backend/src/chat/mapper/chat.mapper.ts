import {Injectable} from "@nestjs/common";
import {ChatDto} from "../dtos/chat.dto";
import {ChatEntity} from "../entities/chat.entity";

@Injectable()
export class ChatMapper{
    toEntity(chatDto: ChatDto): ChatEntity{
        const newEntity = new ChatEntity;

        newEntity.begin_at = chatDto.begin_at;
        return newEntity;
    }

    toDto(chatEntity : ChatEntity): ChatDto{
        const newDto = new ChatDto;

        newDto.id = chatEntity.id;
        newDto.membership = chatEntity.membership;
        newDto.messages = chatEntity.messages;

        return  newDto;
    }
}