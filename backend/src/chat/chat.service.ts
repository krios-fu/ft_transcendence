import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatEntity } from "./entities/chat.entity";
import { ChatRepository } from "./repository/chat.repository";
import { ChatUserEntity } from './entities/chat-user.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: ChatRepository,
        @InjectRepository(ChatUserEntity)
        private chatUserRepository: Repository<ChatUserEntity>,
    ) { }

    public async findChats(): Promise<ChatEntity[]> {
        return await this.chatRepository.find()
    }

    async findOne(id_chat: number): Promise<ChatEntity[]> {
        return (await this.chatRepository.createQueryBuilder('chat'))
            .leftJoinAndSelect('chat.users', 'chat_user')
            .where('chat_user.chatId= :chat_id', { 'chat_id': id_chat })
            .getMany();
    }

    public async findChatsUsers(id_user: number, id_friend: number): Promise<ChatEntity[]> {
        return (await this.chatRepository.createQueryBuilder('chat'))
            .leftJoinAndSelect('chat.users', 'chat_user')
            .where('chat_user.userId= :user_id', { 'user_id': id_user })
            .andWhere('chat_user.userId= :user_id', { 'user_id': id_friend })
            // .orderBy({ 'chat_user.messageId': 'ASC' })
            .getMany();
    }

    public async findChatsUser(id_user: number): Promise<ChatEntity[]> {
        return (await this.chatRepository.createQueryBuilder('chat'))
        .leftJoinAndSelect(
            'chat.users',
            'chat_user',
            'chat_user.userId = :user_id',
            { 'user_id': id_user }
        )
        .leftJoinAndSelect(
            'chat.users',
            'other_user',
            'other_user.chatId = chat.id AND other_user.userId != :user_id',
            { 'user_id': id_user }
        )
        .where('chat_user.userId = :user_id', { 'user_id': id_user })
        .getMany();
 
    }


    // public async getChat(id_user,)

    public async findChats_User(id_user: number, id_chat: number): Promise<ChatEntity[]> {
        return (await this.chatRepository.createQueryBuilder('chat'))
        .leftJoinAndSelect(
            'chat.users',
            'chat_user',
            'chat_user.userId = :user_id',
            { 'user_id': id_user }
        )
        .leftJoinAndSelect(
            'chat.users',
            'other_user',
            'other_user.chatId = chat.id AND other_user.userId != :user_id',
            { 'user_id': id_user }
        )
            .where('chat_user.chatId= :chat_id', { 'chat_id': id_chat })
            .andWhere('chat_user.userId = :user_id', { 'user_id': id_user })

            // .orderBy({ 'chat_user.messageId': 'ASC' })
            .getMany();
    }

    public async findChatMe(id_user: number, id_chat: number): Promise<ChatEntity[]> {
        return (await this.chatRepository.createQueryBuilder('chat'))
        .leftJoinAndSelect(
            'chat.users',
            'chat_user',
            'chat_user.userId = :user_id',
            { 'user_id': id_user }
        )
            .where('chat_user.chatId= :chat_id', { 'chat_id': id_chat })
            .andWhere('chat_user.userId = :user_id', { 'user_id': id_user })

            // .orderBy({ 'chat_user.messageId': 'ASC' })
            .getMany();
        }
        
        public async post(id_user: number, id_friend: number): Promise<ChatEntity> {
            const chats: ChatEntity[] = await this.findChatsUser(id_user)
            
            let chatFriend;
            for ( let chat in chats){
            console.log("CHATS global: ", chats[chat].users )
             chatFriend = chats[chat].users.find( user => user.userId == id_friend)
            if (chatFriend)
                break
        }

        console.log("CHATS FRIEND: ", chatFriend)

        if (chatFriend)
            return chatFriend;

        const chat: ChatEntity = await this.chatRepository.save(new ChatEntity());
        const { id } = chat;

        await this.chatUserRepository.save({ userId: id_user, chatId: id });
        await this.chatUserRepository.save({ userId: id_friend, chatId: id });
        return chat;
    }
}
