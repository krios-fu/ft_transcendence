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
        private chatUserRepository: Repository<ChatUserEntity>
    ) { }

    public async findChats(): Promise<ChatEntity[]> {
        return await this.chatRepository.find()
    }

    async findOne(id_chat: number): Promise<ChatEntity[]> {
        return (await this.chatRepository.createQueryBuilder('chat'))
            .leftJoinAndSelect('chat.chatUser', 'chat_user')
            .where('chat_user.chatId = "chat_id', { 'chat_id': id_chat })
            .getMany();
    }

    public async findChatsUsers(id_user: number, id_friend: number): Promise<ChatEntity[]> {
        return (await this.chatRepository.createQueryBuilder('chat'))
            .leftJoinAndSelect('chat.users', 'chat_user')
            .where('chat_user.userId= :user_id', { 'user_id': id_user })
            .andWhere('chat_user.userId= :user_id', { 'user_id': id_friend })
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

    public async findChatsUser(id_user: number): Promise<ChatEntity[]> {
        return (await this.chatRepository.createQueryBuilder('chat'))
            .leftJoinAndSelect('chat_user', 'chat_user')
            .where('chat_user.userId= :user_id', { 'user_id': id_user })
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

    // public async findChatUser(id_user: number, id_friend: number): Promise<ChatEntity[]> {
    //     let chats: ChatEntity[] = await this.findChatsUser(id_user);
    //     console.log("CHAT FIND", chats);

    //     return chats.filter((chat) => {
    //         return chat.users[0].userId == id_friend
    //             || chat.users[1].userId == id_friend
    //     }
    //     );

    // }

    public async post(id_user: number, id_friend: number): Promise<ChatEntity> {
        const chats: ChatEntity[] = await this.findChatsUsers(id_user, id_friend)

        console.log("CHAT FIND --->", chats[0]['users']);

        // let chat_user = chats.filter((chat) => {
        //     return chat.users[0].userId == friend.id
        //         || chat.users[1].userId == friend.id
        // })
        // console.log("CHAT FIND --->", chat_user);

        // if (chat_user.length !== 0)
        //     return chat_user[0];
        // const chat: ChatEntity = await this.chatRepository.save(new ChatEntity());
        // const { id } = chat;

        // await this.chatUserRepository.save({ userId: user1.id, chatId: id });
        // await this.chatUserRepository.save({ userId: friend.id, chatI0});
        /* check error control here */
        return chats[0];
    }
}
