import {Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {Public} from "../decorators/public.decorator";
import {ChatEntity} from "./entities/chat.entity";
import {ChatDto} from "./dtos/chat.dto";

@Controller('chat')
export class ChatController {
    constructor(
     private chatService: ChatService
    ){
        console.log('Chat controller start')
    }

    @Get()
    @Public()
    async findAll(): Promise<ChatEntity[]> {
        return  this.chatService.findChats();
    }

    @Get(':id')
    @Public()
    async findChat(@Param('id', ParseIntPipe) id: number): Promise<ChatEntity []>{
        let chat  = await this.chatService.findOne(id);
        if (!chat)
            throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);
        return chat;
    }

    @Post()
    @Public()
    async newChat(@Body() newChat: ChatDto): Promise<ChatEntity>{
        return this.chatService.post(newChat);
    }
}
