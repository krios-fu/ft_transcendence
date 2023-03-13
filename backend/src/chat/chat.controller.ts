import { Controller, 
    Get, 
    NotFoundException, 
    Param, 
    ParseIntPipe} from '@nestjs/common';
import { ChatService } from "./chat.service";
import { Public } from "src/common/decorators/public.decorator";
import { ChatEntity } from "./entities/chat.entity";

@Controller('chat')
export class ChatController {
    constructor(
     private chatService: ChatService
    ){ }

    @Get()
    @Public()
    async findAll(): Promise<ChatEntity[]> {
        return  this.chatService.findChats();
    }

    @Get(':id')
    @Public()
    async findChat(@Param('id', ParseIntPipe) id: number): Promise<ChatEntity[]>{
        const chats: ChatEntity[]  = await this.chatService.findOne(id);
        if (chats.length === 0)
            throw new NotFoundException('resource not found in database');
        return chats;
    }
}
