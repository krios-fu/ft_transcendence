import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { Repository } from "typeorm";
import { ChatService } from '../chat.service';
import { ChatMessageEntity } from '../entities/chat-message.entity';
import { ChatUserEntity } from '../entities/chat-user.entity';
import { ChatEntity } from '../entities/chat.entity';
import { ChatMessageRepository } from '../repository/chat-message.repository';

@Injectable()
export class ChatMessageService {
    constructor(
        @InjectRepository(ChatMessageEntity)
        private messageRepository: ChatMessageRepository,
        @InjectRepository(ChatUserEntity)
        private chatUserRepository: Repository<ChatUserEntity>,
        private userService: UserService,
        private chatService: ChatService
    ) { }

    public async findMessages(): Promise<ChatMessageEntity[]> {
        return await this.messageRepository.find()
    }

    public async findOne(id: number): Promise<ChatMessageEntity> {
        return await this.messageRepository.findOne({
            where: {
                id: id
            }
        })
    }



    public async findMessageChats(id_chat: number): Promise<ChatMessageEntity[]> {
        return (await this.messageRepository.createQueryBuilder('chat_messages'))
            .leftJoinAndSelect('chat_messages.chatUser', 'chat_users')
            .leftJoinAndSelect('chat_users.chat', 'chat')

            .where('chat.id = :chatId', { 'chatId': id_chat })
            // .andWhere('chat_user.userId= :user_id', { 'user_id': id_friend })
            // .orderBy({ 'chat_user.messageId': 'ASC' })
            .getMany();
    }

    public async saveMessages(message: any): Promise<ChatMessageEntity> {

        const chatUser = await this.chatService.findChats_User(message.sender, message.id_chat);

        const msg = new ChatMessageEntity({
            'chatUserId': chatUser[0].id,
            'content': message.content,
        });

        await this.messageRepository.save(msg)

        return msg;
    }

}
