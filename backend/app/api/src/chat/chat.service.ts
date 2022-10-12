import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ChatEntity} from "./entities/chat.entity";
import {ChatRepository} from "./repository/chat.repository";
import {ChatDto} from "./dtos/chat.dto";
import {ChatMapper} from "./mapper/chat.mapper";
import {MembershipEntity} from "./entities/membership.entity";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private chatRepository: ChatRepository,
        private chatMapper: ChatMapper
        )
    {
        console.log('chat repo start')
    }

    async findChats(): Promise<ChatEntity[]>{
        return await this.chatRepository.find()
    }

    async findOne(id: string): Promise<ChatEntity[]>{
        return await this.chatRepository.find({
            select:{
                membership:{
                    user:{
                        username : true,
                    }
                },
            },
            // relations: {
            //     membership: true,
            //     messages: false,
            // },

            where:{
                membership:{
                    user:{
                        username: id
                    }
                },
            },

        });
    }

    async post(chat:  ChatDto): Promise<ChatEntity>{
        const mapper = this.chatMapper.toEntity(chat)

        await this.chatRepository.insert(mapper);
            throw  new HttpException('Chat alrady exists', HttpStatus.BAD_REQUEST)
    }
}
