import { MessageEntity } from '../entities/message.entity';
import { MessageService } from './message.service';
export declare class MessageController {
    private messageService;
    constructor(messageService: MessageService);
    findAll(): Promise<MessageEntity[]>;
    findOne(id: number): Promise<MessageEntity>;
}
