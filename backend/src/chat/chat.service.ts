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
            .leftJoinAndSelect('chat.users', 'chat_user')
            // .where('chat_user.userId= :user_id', { 'user_id': id_user })
            // .andWhere('chat_user.userId= :user_id', { 'user_id': id_friend })
            // .orderBy({ 'chat_user.messageId': 'ASC' })
            .getMany();
        /*return await this.chatRepository.find({
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
        })*/
    }

    // public async findChat_user(id_user: number, id_friend: number): Promise<ChatEntity[]> {
    //     let chats: ChatEntity[] = await this.findChatsUser(id_user);
    //     console.log("CHAT FIND", chats);

    //     return chats.filter((chat) => {
    //         return chat.users[0].userId == id_friend
    //             || chat.users[1].userId == id_friend
    //     }
    //     );

    public async findChats_User(id_user: number, id_chat : number): Promise<ChatUserEntity[]> {
        return (await this.chatUserRepository.createQueryBuilder('chat_user'))
            // .leftJoinAndSelect('chat_user.users', 'chat_user')
            .where('chat_user.userId= :user_id', { 'user_id': id_user })
            .andWhere('chat_user.chatId= :chat_id', { 'chat_id': id_chat })
            // .orderBy({ 'chat_user.messageId': 'ASC' })
            .getMany();
    }

    public async post(id_user: number, id_friend: number): Promise<ChatEntity> {
        const chats: ChatEntity[] = await this.findChatsUsers(id_user, id_friend)

        if (chats.length !== 0){
            return chats[0];
        }
        const chat: ChatEntity = await this.chatRepository.save(new ChatEntity());
        const { id } = chat;

        await this.chatUserRepository.save({ userId: id_user, chatId: id });
        await this.chatUserRepository.save({ userId: id_friend, chatId: id});
        return chat;
    }
}
