import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ChatEntity} from "./entities/chat.entity";
import {ChatRepository} from "./repository/chat.repository";
import {ChatDto} from "./dtos/chat.dto";
import {ChatMapper} from "./mapper/chat.mapper";
import {MembershipEntity} from "./entities/membership.entity";
import { UserService } from 'src/user/services/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { MembershipRepository } from './repository/membership.repository';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: ChatRepository,
        private chatMapper: ChatMapper,
        @InjectRepository(MembershipEntity)
        private membershipRepository: MembershipRepository
        )
    {
    }

    async findChats(): Promise<ChatEntity[]>{
        return await this.chatRepository.find()
    }

    async findOne(id_chat: number): Promise<ChatEntity[]>{
        return await this.chatRepository.find({
            select:{
                membership: true,
                messages: false
            },
            where:{
                id : id_chat,
            }

        });
    }

    async findChatsUser(id_user: number ): Promise<ChatEntity[]>{
        return await this.chatRepository.find({
            where:{
                membership : {
                    user: {
                        id : id_user,
                    }
                }
            },
            order:{
                messages: {
                    id : "ASC",
                }
            }
        })
    }

    async findChatUser(id_user: number, id_friend : number): Promise<ChatEntity[]>{
        let chats = await this.chatRepository.find({
            where:{
                membership : {
                    user: {
                        id : id_user,
                    }
                }
            },
            order:{
                messages: {
                    id : "ASC",
                }
            }
        })

    return  chats.filter((chat) => { 
                return chat.membership[0].user.id == id_friend
                || chat.membership[1].user.id == id_friend
            }
        );

    }
    


    async post(user1 : UserEntity, user2: UserEntity): Promise<ChatEntity>{

        const chat_checker = await this.findChatUser(user1.id, user2.id);
            if (chat_checker.length > 0){
                console.log('')
                return chat_checker[0];
            }

        let chat = new ChatEntity();
        await this.chatRepository.insert(chat);


        let membership1  = new MembershipEntity(chat, user1);
        let membership2  = new MembershipEntity(chat, user2);

        await this.membershipRepository.insert(membership1);
        await this.membershipRepository.insert(membership2);
        return chat;
    }
}
