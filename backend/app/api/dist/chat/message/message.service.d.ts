import { UserService } from 'src/user/user.service';
import { ChatService } from '../chat.service';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../repository/message.repository';
export declare class MessageService {
    private messageRepository;
    private userService;
    private chatService;
    constructor(messageRepository: MessageRepository, userService: UserService, chatService: ChatService);
    findMessages(): Promise<MessageEntity[]>;
    findOne(id: number): Promise<MessageEntity>;
    saveMessages(message: any): Promise<MessageEntity>;
}
