import {
    Controller,
    Get,
    NotFoundException,
    BadRequestException,
    Param,
    Logger,
    Post,
    Body,
    ParseIntPipe
} from '@nestjs/common';
import { ChatService } from "./chat.service";
import { Public } from "src/common/decorators/public.decorator";
import { ChatEntity } from "./entities/chat.entity";
import { UserService } from 'src/user/services/user.service';
import { chatPayload } from './dtos/chat.dto';
import { UserCreds } from "../common/decorators/user-cred.decorator";
import { UserEntity } from "../user/entities/user.entity";
import { UserCredsDto } from 'src/common/dtos/user.creds.dto';

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService,
        private userService: UserService,
    ) {
        this.chatLogger = new Logger(ChatController.name);
    }
    private readonly chatLogger: Logger;

    @Get()
    @Public()
    async findAll(): Promise<ChatEntity[]> {
        return this.chatService.findChats();
    }

    // @Get(':id')
    // @Public()
    // public async findChat(@Param('id', ParseIntPipe) id: number): Promise<ChatEntity[]>{
    //     const chats: ChatEntity[]  = await this.chatService.findOne(id);
    //     if (chats.length === 0) {
    //         this.chatLogger.error( `Chat with ${id} is not present in database`);
    //         throw new NotFoundException('resource not found in database');
    //     }
    //     return chats;
    // }

    @Get('me')
    public async findChats(@UserCreds() userCreds: UserCredsDto) {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.chatLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }

        let lol = await this.chatService.findChatsUser(user.id);
        return lol;
    }

    @Get(':id')
    async findChat(@UserCreds() userCreds: UserCredsDto, @Param('id', ParseIntPipe) id: number): Promise<ChatEntity[]> {
        const { username } = userCreds;
        const user = await this.userService.findOneByUsername(username);

        const chats: ChatEntity[] = await this.chatService.findChats_User(user.id, id);
        if (chats.length === 0) {
            this.chatLogger.error(`Chat with ${id} is not present in database`);
            throw new NotFoundException('resource not found in database');
        }
        return chats;
    }

    @Get('me/:nick_friend')
    async findChatWithFriend(
        @UserCreds() userCreds: UserCredsDto,
        @Param('nick_friend') nick_friend: string) {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.chatLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        const friend: UserEntity = await this.userService.findOneByNickName(nick_friend);

        if (friend === null) {
            this.chatLogger.error(`User with login ${nick_friend} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        return await this.chatService.findChatsUsers(user.id, friend.id);
    }

    @Post('me')
    async postChat(
        @UserCreds() userCreds: UserCredsDto,
        @Body() payload: chatPayload) {
        const { username } = userCreds;
        const user1: UserEntity = await this.userService.findOneByUsername(username);

        if (user1 === null) {
            this.chatLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        const user2: UserEntity = await this.userService.findOne(payload.friendId);
        if (user2 === null) {
            this.chatLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        return await this.chatService.post(user1.id, user2.id);
    }

}
