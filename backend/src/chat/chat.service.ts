import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ChatEntity} from "./entities/chat.entity";
import {ChatRepository} from "./repository/chat.repository";
import {ChatDto} from "./dtos/chat.dto";
import {ChatMapper} from "./mapper/chat.mapper";
import {MembershipEntity} from "./entities/membership.entity";
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: ChatRepository,
        private chatMapper: ChatMapper,
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
    


    async post(chat:  ChatDto): Promise<ChatEntity>{
        const mapper = this.chatMapper.toEntity(chat)

        await this.chatRepository.insert(mapper);
            throw  new HttpException('Chat alrady exists', HttpStatus.BAD_REQUEST)
    }
}
