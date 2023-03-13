import { Controller, 
    Get, 
    NotFoundException, 
    Param,
    Logger,
    ParseIntPipe} from '@nestjs/common';
import { ChatService } from "./chat.service";
import { Public } from "src/common/decorators/public.decorator";
import { ChatEntity } from "./entities/chat.entity";

@Controller('chat')
export class ChatController {
    constructor(
     private chatService: ChatService
    ){ 
        this.chatLogger = new Logger(ChatController.name);
    }
    private readonly chatLogger: Logger;

    @Get()
    @Public()
    async findAll(): Promise<ChatEntity[]> {
        return  this.chatService.findChats();
    }

    @Get(':id')
    @Public()
    async findChat(@Param('id', ParseIntPipe) id: number): Promise<ChatEntity[]>{
        const chats: ChatEntity[]  = await this.chatService.findOne(id);
        if (chats.length === 0) {
            this.chatLogger.error( `Chat with ${id} is not present in database`);
            throw new NotFoundException('resource not found in database');
        }
        return chats;
    }
}
