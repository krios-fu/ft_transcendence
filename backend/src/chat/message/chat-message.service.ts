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
		private userService : UserService,
		private chatService : ChatService
	)
	{
		console.log('message repo start')
	}

	public async findMessages(): Promise<ChatMessageEntity[]>{
		return await this.messageRepository.find()
	}

	public async findOne(id: number): Promise<ChatMessageEntity>{
		return await this.messageRepository.findOne({
			where: {
				id : id
			}
		})
	}

	public async saveMessages(message : any ) : Promise<ChatMessageEntity>{
		const receiver: UserEntity = await this.userService.findOneByUsername(message.receiver);
		const author: UserEntity = await this.userService.findOneByUsername(message.sender);
		const chat: ChatEntity = await (this.chatService.findChatUser(author.id, receiver.id))[0];
		const chatUser: ChatUserEntity = await this.chatUserRepository.save(new ChatUserEntity({
			'chatId': chat.id,
			'userId': author.id
		}));
		const msg = new ChatMessageEntity({
			'chatUserId': chatUser.id,
			'content': message.content,
		});
		
		await this.messageRepository.insert(msg)
		return msg;
	}

}
