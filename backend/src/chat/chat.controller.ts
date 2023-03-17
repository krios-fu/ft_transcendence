import { Controller,
    Get,
    NotFoundException,
    Param,
    Logger,
    HttpException,
    Req,
    Post,
    Body,
    HttpStatus,
    ParseIntPipe} from '@nestjs/common';
import { ChatService } from "./chat.service";
import { Public } from "src/common/decorators/public.decorator";
import { ChatEntity } from "./entities/chat.entity";
import { UserService } from 'src/user/services/user.service';
import { IRequestUser } from 'src/common/interfaces/request-payload.interface';
import { chatPayload } from './dtos/chat.dto';

@Controller('chat')
export class ChatController {
    constructor(
     private chatService: ChatService
    ) { }
     private chatService: ChatService,
     private userService: UserService,
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

    @Get('me')
    async findChats(@Req() req: IRequestUser) {
        const username = req.user.data.username;
        if (username === undefined) {
            this.chatLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(req.user.data.username);
        if (user === null) {
            this.chatLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }

        let lol = await this.chatService.findChatsUser(user.id);
        console.log('chats:',  lol);
        return lol;
    }

    @Get('me/:nick_friend')
    async findChatWithFriend(@Req() req: IRequestUser, @Param('nick_friend') nick_friend: string) {
        const username = req.user.data.username;
        if (username === undefined) {
            this.chatLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(req.user.data.username);
        if (user === null) {
            this.chatLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }

        const friend = await this.userService.findOneByNickName(nick_friend);

        if (friend === null) {
            this.chatLogger.error(`User with login ${nick_friend} not present in database`);
            throw new HttpException('friend not found in database', HttpStatus.BAD_REQUEST);
        }

        return await this.chatService.findChatsUsers(user.id, friend.id);

    }

    @Post('me')
    async postChat(
        @Req() req: IRequestUser,
        @Body() payload: chatPayload) {
        const username = req.user.data.username;
        if (username === undefined) {
            this.chatLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user1 = await this.userService.findOneByUsername(username);

        console.log(user1);
        if (user1 === null) {
            this.chatLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }
        const user2 = await this.userService.findOne(payload.friendId);
        console.log(user2)

        return this.chatService.post(user1.id, user2.id);
    }

}
