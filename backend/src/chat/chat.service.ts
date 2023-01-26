import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ChatEntity } from "./entities/chat.entity";
import { ChatRepository } from "./repository/chat.repository";
import { ChatMapper } from "./mapper/chat.mapper";
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: ChatRepository,
        private chatMapper: ChatMapper,
    ) {
    }

    async findChats(): Promise<ChatEntity[]> {
        return await this.chatRepository.find()
    }

    async findOne(id_chat: number): Promise<ChatEntity[]> {
        return await this.chatRepository.find({
            select: {
                users: true,
                messages: false
            },
            where: {
                id: id_chat,
            }

        });
    }

    async findChatsUser(id_user: number): Promise<ChatEntity[]> {
        return await this.chatRepository.find({
            relations: {
                users: true,
                messages: true,
            },
            where: {
                users: {
                    id: id_user,
                }
            },
            order: {
                messages: {
                    id: "ASC",
                }
            }
        })
    }

    async findChatUser(id_user: number, id_friend: number): Promise<ChatEntity[]> {
        let chats = await this.findChatsUser(id_user);

        return chats.filter((chat) => {
            return chat.users[0].id == id_friend
                || chat.users[1].id == id_friend
        }
        );

    }

    async post(user1: UserEntity, user2: UserEntity): Promise<ChatEntity> {

        const chatid = await this.findChatUser(user1.id, user2.id)
        if (chatid.length !== 0)
            return chatid[0];

        let chat = new ChatEntity();
        chat.users = [user1, user2];
        await this.chatRepository.save(chat);
        return chat;
    }
}
