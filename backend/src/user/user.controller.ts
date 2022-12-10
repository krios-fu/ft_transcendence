import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    Patch,
    ParseIntPipe,
    Query,
    Logger,
    HttpException,
    HttpStatus,
    Req,
    UploadedFile,
    UseInterceptors,
    ParseFilePipeBuilder,

} from '@nestjs/common';
import { CreateUserDto, SettingsPayloadDto, UpdateUserDto } from './dto/user.dto';
import { UpdateResult } from 'typeorm';
import { UserQueryDto } from './dto/user.query.dto';
import { IRequestUser } from 'src/common/interfaces/request-payload.interface';
import { BlockPayloadDto, CreateFriendDto, FriendshipPayload } from './dto/friendship.dto';
import { FriendshipEntity } from './entities/friendship.entity';
import { UserService } from './services/user.service';
import { FriendshipService } from './services/friendship.service';
import { UserEntity } from './entities/user.entity';
import { BlockService } from './services/block.service';
import { ChatService } from 'src/chat/chat.service';
import { chatPayload } from 'src/chat/dtos/chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly blockService: BlockService,
        private readonly friendshipService: FriendshipService,
        private readonly chatService: ChatService,
    ) {
        this.userLogger = new Logger(UserController.name);
    }
    private readonly userLogger: Logger;

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **
    **                                               **
    **              ( user endpoints )               **
    **                                               **
    ** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


    /*
    ** Find all users registered into the app.
    ** Accepts query as optional parameter.
    */

    @Get()
    async findAllUsers(@Query() queryParams: UserQueryDto): Promise<UserEntity[]> {
        return this.userService.findAllUsers(queryParams);
    }

    /*
    ** Get request user info.
    ** (User must be himself)
    */

    @Get('me')
    public async findMe(@Req() req: IRequestUser) {
        const username = req.user.data.username;

        if (username === undefined) {
            this.userLogger.error('Cannot find username for client in request body');
            throw new HttpException('user has no valid credentials', HttpStatus.BAD_REQUEST);
        }
        return await this.userService.findAllUsers({ "filter": { "username": [username] } });
    }

    /*
    ** Find one user registered into app by id (regex: param must be a number).
    */

    @Get('$(0-9)*^')
    async findOneUser(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        const user = await this.userService.findOne(id);
        if (user === null) {
            this.userLogger.error(`User with id ${id} not found in database`);
            throw new HttpException('no user in db', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    /*
    ** Find one user registered into the app by username.
    ** (regex: param must be only ascii characters).
    */

    @Get('$(A-Za-z\-)*^')
    public async findOneUserByUsername(@Param('id') id: string): Promise<UserEntity> {
        const user = await this.userService.findOneByUsername(id);
        if (user === null) {
            this.userLogger.error(`User with login ${id} not found in database`);
            throw new HttpException('no user in db', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    /* role guards ?? (or admin) */
    /* it is me! */
    @Post()
    async postUser(@Body() newUser: CreateUserDto): Promise<UserEntity> {
        if (await this.userService.findOneByUsername(newUser.username) !== null) {
            this.userLogger.error(`User with id ${newUser.username} already exists in database`);
            throw new HttpException('User already exists',
                HttpStatus.BAD_REQUEST);
        }
        return this.userService.postUser(newUser);
    }


    /*
    **  It can only change a user's:
    **      - photoUrl
    **      - nickname
    **      - doubleAuth (boolean)
    */

    /* it is me! (or admin) */
    @Patch(':id')
    public async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto
    ): Promise<UserEntity> {
        await this.userService.updateUser(id, dto);
        return await this.userService.findOne(id);
    }

    @Patch('me')
    public async updateMeUser(
        @Req() req: IRequestUser,
        @Body() dto: UpdateUserDto
    ): Promise<UserEntity> {

        console.log('UPDATE USER', dto);
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(req.user.data.username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }
        await this.userService.updateUser(user.id, dto);
        return await this.userService.findOne(user.id);
    }

    @Patch('me/settings')
    public async updateSettings(
        @Body() settingsDto: SettingsPayloadDto,
        @Req() req: IRequestUser,

    ): Promise<UpdateResult> {
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(req.user.data.username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }
        if (user === null) {
            this.userLogger.error(`User with id ${user.id} not found in database`);
            throw new HttpException('no user in database', HttpStatus.BAD_REQUEST);
        }
        return this.userService.updateSettings(user.id, settingsDto);
    }

<<<<<<< HEAD
    @Post('me/avatar')
    @UseInterceptors(FileInterceptor(
        'avatar', 
        {
            storage: diskStorage({
                destination: './uploads',
                filename: (
                    req:  IRequestUser, 
                    file: Express.Multer.File,
                    cb:   Function) => {
                    const filename = `${req.user.data.username}.`;
                }
            }),
        },
        fileFilter: (req: IRequestUser, file: Express.Multer.File, cb: Function) => {
            
        }
    )) // <-- aqui los parseos de tamaño y seguridad
=======

    @Post('me/avatar/upload')
    @UseInterceptors(
        FileInterceptor(
            'avatar',
            { dest: './uploads/' },
            //    fileFilter()
        )
    ) // <-- aqui los parseos de tamaño y seguridad
>>>>>>> main
    public async uploadAvatar(
        @UploadedFile() avatar: Express.Multer.File
    ) {

        /* 
        ** upload new avatar
        **      upload: edit user entity with new path to image
        **      -> path to image created by nest
        */
        console.log('test');
    }

    /*
    **  Remove an avatar previously uploaded by user.
    **  (what if user has no uploaded avatar but is still working with default provided by 42??)
    **  (what if user removes custom avatar? do we return to default one? is there a default avatar??)
    **/

    @Delete('me/avatar')

    /* it is me! (or admin) */
    @Delete(':id')
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.userService.deleteUser(id);
    }


    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **
    **                                               **
    **           ( chat endpoints )            **
    **                                               **
    ** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    /*
    ** 
    ** 
    */

    @Get('me/chats')
    async findChats(@Req() req: IRequestUser) {
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(req.user.data.username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }

        let lol = await this.chatService.findChatsUser(user.id);
        console.log('chats:',  lol);
        return lol;
    }

    @Get('me/chat/:nick_friend')
    async findChat(@Req() req: IRequestUser, @Param('nick_friend') nick_friend: string) {

        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(req.user.data.username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }

        const friend = await this.userService.findOneByNickName(nick_friend);

        if (friend === null) {
            this.userLogger.error(`User with login ${nick_friend} not present in database`);
            throw new HttpException('friend not found in database', HttpStatus.BAD_REQUEST);
        }

        return await this.chatService.findChatUser(user.id, friend.id);

    }

    @Post('me/chat')
    async postChat(
        @Req() req: IRequestUser,
        @Body() payload: chatPayload) {
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user1 = await this.userService.findOneByUsername(username);

        console.log(user1);
        if (user1 === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }
        const user2 = await this.userService.findOne(payload.friendId);
        console.log(user2)

        return this.chatService.post(user1, user2);

    }
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **
    **                                               **
    **           ( friendship endpoints )            **
    **                                               **
    ** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    /*
    ** Get all friends from user
    ** (user_id must be my id or I need to be an admin)
    */

    @Get(':user_id/friends')
    public async getFriends(@Param('user_id', ParseIntPipe) userId: number): Promise<FriendshipEntity[]> {
        return await this.friendshipService.getFriends(userId);
    }


    /*
    ** Get my friends (I must be me)
    */

    @Get('me/friends')
    public async getMyFriends(@Req() req: IRequestUser): Promise<FriendshipEntity[]> {
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }
        return await this.friendshipService.getFriends(user.id);
    }

    /* 
    ** Get one friend from user by id
    */

    @Get('me/friends/:friend_id')
    public async getOneFriend(
        @Req() req: IRequestUser,
        @Param('friend_id', ParseIntPipe) friendId: number
    ): Promise<FriendshipEntity> {
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }
        return this.friendshipService.getOneFriend(user.id, friendId);
    }

    /* 
    ** Create a new friendship for requesting user.
    ** User ID must be read from credentials in request.
    */

    @Post('me/friends')
    async postFriend(
        @Req() req: IRequestUser,
        @Body() dto: FriendshipPayload,
    ): Promise<FriendshipEntity> {
        console.log('frienddd', dto);
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(username);
        console.log('frienddd', user);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }
        return this.friendshipService.addFriend(new CreateFriendDto(user.id, dto));
    }

    /*
    **  Changes a friendship's status from PENDING to CONFIRMED
    **  if username of the request matches the receiverId in friendship.
    */

    //UseGuards(ItIsMe)
    @Patch(':user_id/friends/:friend_id/accept')
    async acceptFriend(
        @Param('user_id', ParseIntPipe) userId: number,
        @Param('friend_id', ParseIntPipe) friendId: number,
    ): Promise<UpdateResult> {
        if ((await this.userService.findAllUsers({ filter: { id: [userId, friendId] } }))
            .length != 2) {
            this.userLogger.error(`No user pair {${userId}, ${friendId}} found in database`);
            throw new HttpException('user not found in db', HttpStatus.BAD_REQUEST);
        }
        return this.friendshipService.acceptFriend(userId, friendId);
    }

    /*
    **  Changes a friendship's status from PENDING to REFUSED
    **  if username of the request matches the receiverId in friendship.
    */

    //UseGuards(ItIsMe)
    @Patch(':user_id/friends/:friend_id/refuse')
    async refuseFriend(
        @Param('user_id', ParseIntPipe) userId: number,
        @Param('friend_id', ParseIntPipe) friendId: number,
    ): Promise<UpdateResult> {
        if ((await this.userService.findAllUsers({ filter: { id: [userId, friendId] } }))
            .length != 2) {
            this.userLogger.error(`No user pair {${userId}, ${friendId}} found in database`);
            throw new HttpException('user not found in db', HttpStatus.BAD_REQUEST);
        }
        return this.friendshipService.refuseFriend(userId, friendId);
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **
    **                                               **
    **              ( block endpoints )              **
    **                                               **
    ** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    @Get('me/blocked')
    async getBlockedFriends(@Req() req: IRequestUser): Promise<FriendshipEntity[]> {
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error(`User requesting service is not logged in`);
            throw new HttpException('user not logged int', HttpStatus.UNAUTHORIZED);
        }
        const me = await this.userService.findOneByUsername(username);
        if (me === null) {
            this.userLogger.error(`User with login ${username} not found in database`);
            throw new HttpException('user not found in db', HttpStatus.BAD_REQUEST);
        }
        return this.blockService.getBlockedFriends(me.id);
    }

    /*
    **  Changes a friendship's status from CONFIRMED to BLOCKED,
    **  and adds a row in BlockEntity table.
    */

    @Post('me/blocked')
    async blockFriend(
        @Req() req: IRequestUser,
        @Body() dto: BlockPayloadDto,
    ): Promise<UpdateResult> {
        const username = req.user.data.username;
        const me = await this.userService.findOneByUsername(username);

        if (me === null) {
            this.userLogger.error(`User with username ${username} not found in database`);
            throw new HttpException('user not found in db', HttpStatus.BAD_REQUEST);
        }
        const friendship = await this.friendshipService.getOneFriend(me.id, dto.blockReceiverId);
        if (friendship === null) {
            this.userLogger.error(`No friendship between users ${me.id} and ${dto.blockReceiverId}`);
            throw new HttpException('no friendship in db', HttpStatus.BAD_REQUEST);
        }
        return this.blockService.blockFriend({
            'friendshipId': friendship.id,
            'senderId': me.id
        });
    }

    /*
    **  The friendship blocker requests to unblock the friendship.
    */

    @Delete('me/blocked/:id')
    public async unblockFriend(
        @Req() req: IRequestUser,
        @Param('id', ParseIntPipe) id: number
    ): Promise<UpdateResult> {
        const username = req.user.data.username;
        if (username == null) {
            this.userLogger.error(`Request user is not logged in`);
            throw new HttpException('user not logged in', HttpStatus.UNAUTHORIZED);
        }
        const me = await this.userService.findAllUsers(
            {
                "filter": { "username": [username] }
            });
        if (me === null) {
            this.userLogger.error(`User with login ${username} not found in database`);
            throw new HttpException('no user in db', HttpStatus.BAD_REQUEST);
        }
        return await this.blockService.unblockFriend(me[0].id, id);
    }
}
