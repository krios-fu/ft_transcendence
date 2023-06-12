import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ChatMessageEntity } from '../entities/chat-message.entity'
import { ChatMessageService } from './chat-message.service';
@Controller('message')
export class ChatMessageController {
	constructor(
		private messageService: ChatMessageService
	){}

	@Get()
	@Public()
	async findAll() : Promise<ChatMessageEntity[]> {
		return this.messageService.findMessages();
	}

	@Get(':id')
	@Public()
	async findOne(@Param('id', ParseIntPipe) id : number) : Promise<ChatMessageEntity>{
		return this.messageService.findOne(id);
	}

	@Get('chat/:chat_id')
	@Public()
	async findMessageChat(@Param('chat_id', ParseIntPipe) id : number) : Promise<ChatMessageEntity[]>{
		const messages = await this.messageService.findMessageChats(id);
		console.log('MESSAGE', messages);
		return messages
	}
}
