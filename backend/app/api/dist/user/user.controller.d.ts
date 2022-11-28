import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UpdateUser, UserDto } from './user.dto';
import { UpdateResult } from 'typeorm';
import { ChatService } from 'src/chat/chat.service';
export declare class UserController {
    private userService;
    private chatService;
    constructor(userService: UserService, chatService: ChatService);
    findAllUsers(): Promise<UserEntity[]>;
    findOneUser(id: string): Promise<UserEntity>;
    findChats(id: string): Promise<any>;
    findChat(id: string, id_friend: string): Promise<any>;
    postUser(newUser: UserDto): Promise<UserEntity>;
    updateUser(id: string, body: UpdateUser): Promise<UpdateResult>;
    remove(id: string): Promise<void>;
}
