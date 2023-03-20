import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
<<<<<<< HEAD:backend/src/chat/message/message.controller.ts
import { Public } from '../../common/decorators/public.decorator';
import { MessageEntity } from '../entities/message.entity'
import { MessageService } from './message.service';
=======
import { Public } from 'src/common/decorators/public.decorator';
import { ChatMessageEntity } from '../entities/chat-message.entity'
import { ChatMessageService } from './chat-message.service';
>>>>>>> main:backend/src/chat/message/chat-message.controller.ts
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
}
