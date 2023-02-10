import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../../user/services/user.service';
import { ChatService } from '../chat.service';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../repository/message.repository';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private messageRepository: MessageRepository,
		private userService : UserService,
		private chatService : ChatService
	)
	{ }

	async findMessages(): Promise<MessageEntity[]>{
		return await this.messageRepository.find()
	}

	async findOne(id: number): Promise<MessageEntity>{
		return await this.messageRepository.findOne({
			where: {
				id : id
			}
		})
	}

	async saveMessages(message : any ) : Promise<MessageEntity>{

		let msg = new MessageEntity();

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
