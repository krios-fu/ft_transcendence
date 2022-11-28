import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { MessageEntity } from '../entities/message.entity'
import { MessageService } from './message.service';
@Controller('message')
export class MessageController {
	constructor(
		private messageService: MessageService
	){}

	@Get()
	@Public()
	async findAll() : Promise<MessageEntity[]> {
		return this.messageService.findMessages();
	}

	@Get(':id')
	@Public()
	async findOne(@Param('id', ParseIntPipe) id : number) : Promise<MessageEntity>{
		return this.messageService.findOne(id);
	}
}
