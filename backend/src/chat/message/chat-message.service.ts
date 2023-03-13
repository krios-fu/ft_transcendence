import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/services/user.service';
import { ChatService } from '../chat.service';
import { ChatMessageEntity } from '../entities/message.entity';
import { ChatMessageRepository } from '../repository/chat-message.repository';

@Injectable()
export class ChatMessageService {
	constructor(
		@InjectRepository(ChatMessageEntity)
		private messageRepository: ChatMessageRepository,
		private userService : UserService,
		private chatService : ChatService
	)
	{
		console.log('message repo start')
	}

	async findMessages(): Promise<ChatMessageEntity[]>{
		return await this.messageRepository.find()
	}

	async findOne(id: number): Promise<ChatMessageEntity>{
		return await this.messageRepository.findOne({
			where: {
				id : id
			}
		})
	}

	async saveMessages(message : any ) : Promise<ChatMessageEntity>{

		let msg = new ChatMessageEntity();
		let reciver = await this.userService.findOneByUsername(message.reciver);

		msg.author = await this.userService.findOneByUsername(message.sender);
		msg.chat = (await this.chatService.findOne(
			(await this.chatService.findChatUser(msg.author.id, reciver.id))[0].id
		))[0];
		msg.content = message.content; 
		await this.messageRepository.insert(msg)
		return msg;
	}

}
