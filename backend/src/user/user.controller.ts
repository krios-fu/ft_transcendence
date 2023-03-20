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
    Req,
    UploadedFile,
    UseInterceptors,
    NotFoundException,
    HttpCode,
    BadRequestException, 
    UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, SettingsPayloadDto, UpdateUserDto } from './dto/user.dto';
import { UpdateResult } from 'typeorm';
import { UserQueryDto } from './dto/user.query.dto';
import { IRequestUser } from '../common/interfaces/request-payload.interface';
import { BlockPayloadDto, CreateFriendDto, FriendshipPayload } from './dto/friendship.dto';
import { FriendshipEntity } from './entities/friendship.entity';
import { UserService } from './services/user.service';
import { FriendshipService } from './services/friendship.service';
import { UserEntity } from './entities/user.entity';
import { BlockService } from './services/block.service';
import { chatPayload } from 'src/chat/dtos/chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidatorPipe } from 'src/common/validators/filetype-validator.class';
import { UserCreds } from 'src/common/decorators/user-cred.decorator';
import { uploadUserAvatarSettings } from 'src/common/config/upload-avatar.config';
import { Express } from 'express';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly blockService: BlockService,
        private readonly friendshipService: FriendshipService,
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
    async findAllUsers(@Query() queryParams: UserQueryDto): Promise<UserEntity[] | [UserEntity[], number]> {
        if (queryParams.count)
            return await this.userService.findAndCountAllUsers(queryParams);
        return await this.userService.findAllUsers(queryParams);
    }

    /*
    ** Get request user info.
    ** (User must be himself)
    */

    @Get('me')
    public async findMe(@UserCreds() username: string) {
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
            throw new NotFoundException('no user in db');
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
            throw new NotFoundException('no user in db');
        }
        return user;
    }

    /* role guards ?? (or admin) */
    /* it is me! */
    @Post()
    async postUser(@Body() newUser: CreateUserDto): Promise<UserEntity> {
        if (await this.userService.findOneByUsername(newUser.username) !== null) {
            this.userLogger.error(`User with id ${newUser.username} already exists in database`);
            throw new BadRequestException('User already exists');
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
        @Body() dto: UpdateUserDto,
        @UserCreds() username: string
    ): Promise<UserEntity> {
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        await this.userService.updateUser(user.id, dto);
        return await this.userService.findOne(user.id);
    }

    @Patch('me/settings')
    public async updateSettings(
        @Body() settingsDto: SettingsPayloadDto,
        @UserCreds() username: string
    ): Promise<UpdateResult> {
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        if (user === null) {
            this.userLogger.error(`User with id ${user.id} not found in database`);
            throw new BadRequestException('no user in database');
        }
        return this.userService.updateUser(user.id, settingsDto);
    }

    /*
    ** Allows avatar uploading to user with credentials present in request.
    ** File being uploaded will be parsed and validated for security reasons.
    */

    @Post('me/avatar')
    @UseInterceptors(FileInterceptor(
        'avatar', uploadUserAvatarSettings
    ))
    public async uploadMyAvatar(
        @UploadedFile(FileTypeValidatorPipe) avatar: Express.Multer.File,
        @UserCreds() username: string,
        @Req() req: Request
    ) {
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        const photoUrl = `http://localhost:3000/${avatar.path.replace('public/', '')}`;
        return await this.userService.updateUser(user.id, { photoUrl: photoUrl });
    }

    /*
    ** Same as above, gives access to avatar posting to site admin.
    */

    /* @UseGuards(IdentityGuard) */
    @Post(':id/avatar')
    @UseInterceptors(FileInterceptor(
        'avatar', uploadUserAvatarSettings
    ))
    public async uploadUserAvatar(
        @Param('id', ParseIntPipe) userId: number,
        @UploadedFile(FileTypeValidatorPipe) avatar: Express.Multer.File
    ):Promise<UpdateResult> {
        const user: UserEntity = await this.userService.findOne(userId);

        if (user === null) {
            this.userLogger.error(`User with id ${userId} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        const photoUrl = `http://localhost:3000/${avatar.path.replace('public/', '')}`;
        return await this.userService.updateUser(user.id, { photoUrl: photoUrl });
    }


    /*
    **  Remove an avatar previously uploaded by user.
    **  (what if user has no uploaded avatar but is still working with default provided by 42??)
    **  (what if user removes custom avatar? do we return to default one? is there a default avatar??)
    **/

    @Delete('me/avatar')
    @HttpCode(204)
    public async deleteMyAvatar(@UserCreds() username: string): Promise<void> {
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        const { id, photoUrl } = user;
        return await this.userService.deleteAvatar(id, photoUrl);
    }

    @Delete(':id/avatar')
    @HttpCode(204)
    //@UseGuards(IdentityGuard)
    public async deleteUserAvatar(@Param('id', ParseIntPipe) userId: number): Promise<void> {
        const user: UserEntity = await this.userService.findOne(userId);

        if (user === null) {
            this.userLogger.error(`User with id ${userId} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        const { id, photoUrl } = user;
        return await this.userService.deleteAvatar(id, photoUrl);
    }
   

    /* it is me! (or admin) */
    @Delete(':id')
    @HttpCode(204)
    //@UseGuards(IdentityGuard)
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        const user = await this.userService.findOne(id);
        if (user === null) {
            this.userLogger.error(`User with id ${id} not found in database`);
            throw new NotFoundException('resource not found');
        }
        return this.userService.deleteUser(user);
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

    // @Get(':user_id/friends')
    // public async getFriends(@Param('user_id', ParseIntPipe) userId: number): Promise<FriendshipEntity[]> {
    //     return await this.friendshipService.getFriends(userId);
    // }


    /*
    ** Get my friends (I must be me)
    */

    @Get('me/friends')
    public async getMyFriends(@UserCreds() username: string): Promise<FriendshipEntity[]> {
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new UnauthorizedException('request user has not logged in');
        }
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        return await this.friendshipService.getFriends(user.id);
    }
    
    @Get(':id/friends')
    public async getUserFriends(@Param('id', ParseIntPipe) userId: number,): Promise<FriendshipEntity[]> {
        // const username = req.user.data.username;
        // if (username === undefined) {
        //     this.userLogger.error('request user has not logged in');
        //     throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        // }
        // const user = await this.userService.findOneByUsername(username);
        // if (user === null) {
        //     this.userLogger.error(`User with login ${username} not present in database`);
        //     throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        // }
        return await this.friendshipService.getFriends(userId);
    }

    @Get('me/friends/as_pending')
    public async getFriendsAsPending(@UserCreds() username: string): Promise<FriendshipEntity[]> {
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new UnauthorizedException('request user has not logged in');
        }
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        return await this.friendshipService.getPossibleFriends(user.id);
    }

    /* 
    ** Get one friend from user by id
    */

    @Get('me/friends/:friend_id')
    public async getOneFriend(
        @UserCreds() username: string,
        @Param('friend_id', ParseIntPipe) friendId: number
    ): Promise<FriendshipEntity> {
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new UnauthorizedException('request user has not logged in');
        }
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        return this.friendshipService.getOneFriend(user.id, friendId);
    }

    /* 
    ** Create a new friendship for requesting user.
    ** User ID must be read from credentials in request.
    */

    @Post('me/friends')
    async postFriend(
        @UserCreds() username: string,
        @Body() dto: FriendshipPayload,
    ): Promise<FriendshipEntity> {
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new UnauthorizedException('request user has not logged in');
        }
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        return this.friendshipService.addFriend(new CreateFriendDto(user.id, dto));
    }

    /*
    **  Changes a friendship's status from PENDING to CONFIRMED
    **  if username of the request matches the receiverId in friendship.
    */

    //UseGuards(ItIsMe)
    @Patch('me/friends/:friend_id/accept')
    public async acceptFriend(
        @UserCreds() username: string,
        @Param('friend_id', ParseIntPipe) friendId: number,
    ): Promise<UpdateResult> {
        const { id: userId } = await this.userService.findOneByUsername(username);
        if ((await this.userService.findAllUsers({ filter: { id: [userId, friendId] } }))
            .length != 2) {
            this.userLogger.error(`No user pair {${userId}, ${friendId}} found in database`);
            throw new BadRequestException('user not found in db');
        }
        return this.friendshipService.acceptFriend(userId, friendId);
    }

    @Patch('me/friends/accept')
    public async meAcceptFriend(
        // @Param('user_id', ParseIntPipe) userId: number,
        // @Param('friend_id', ParseIntPipe) friendId: number,
        @Req() req: IRequestUser,
        @Body() friend: any
    ): Promise<UpdateResult> {
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new UnauthorizedException('request user has not logged in');
        }
        const user = await this.userService.findOneByUsername(username);
       const  userId = user.id;
       const friendId = friend.id;
       console.log("friends", userId,"<--->" ,friendId)
        if ((await this.userService.findAllUsers({ filter: { id: [userId, friendId] } }))
            .length != 2) {
            this.userLogger.error(`No user pair {${userId}, ${friendId}} found in database`);
            throw new BadRequestException('user not found in db');
        }
        return this.friendshipService.acceptFriend(userId, friendId);
    }

    @Delete('me/friends/deleted/:id')
    public async meDeletedFriend(
        @Param('id', ParseIntPipe) id_deleted: number,
        // @Param('friend_id', ParseIntPipe) friendId: number,
        @Req() req: IRequestUser,
        @Body() friend: any
    ) {
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new BadRequestException('request user has not logged in');
        }
        const user = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        return this.friendshipService.deletedFriend(id_deleted);
    }

    /*
    **  Changes a friendship's status from PENDING to REFUSED
    **  if username of the request matches the receiverId in friendship.
    */

    @Patch('me/friends/:friend_id/refuse')
    public async refuseFriend(
        @UserCreds() username: string,
        @Param('friend_id', ParseIntPipe) friendId: number,
    ): Promise<UpdateResult> {
        const { id: userId } = await this.userService.findOneByUsername(username);
        /* protect this */
        if ((await this.userService.findAllUsers({ filter: { id: [userId, friendId] } }))
            .length != 2) {
            this.userLogger.error(`No user pair {${userId}, ${friendId}} found in database`);
            throw new BadRequestException('user not found in db');
        }
        return this.friendshipService.refuseFriend(userId, friendId);
    } /* should not return updateResult */

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **
    **                                               **
    **              ( block endpoints )              **
    **                                               **
    ** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    @Get('me/blocked')
    public async getBlockedFriends(@Req() req: IRequestUser): Promise<FriendshipEntity[]> {
        const username = req.user.data.username;
        if (username === undefined) {
            this.userLogger.error(`User requesting service is not logged in`);
            throw new UnauthorizedException('user not logged int');
        }
        const me = await this.userService.findOneByUsername(username);
        if (me === null) {
            this.userLogger.error(`User with login ${username} not found in database`);
            throw new BadRequestException('user not found in db');
        }
        return this.blockService.getBlockedFriends(me.id);
    }

    /*
    **  Changes a friendship's status from CONFIRMED to BLOCKED,
    **  and adds a row in BlockEntity table.
    */

    @Post('me/blocked')
    async blockFriend(
        @UserCreds() username: string,
        @Body() dto: BlockPayloadDto,
    ): Promise<UpdateResult> {
        const me = await this.userService.findOneByUsername(username);
        if (me === null) {
            this.userLogger.error(`User with username ${username} not found in database`);
            throw new BadRequestException('user not found in db');
        }
        const friendship = await this.friendshipService.getOneFriend(me.id, dto.blockReceiverId);
        if (friendship === null) {
            this.userLogger.error(`No friendship between users ${me.id} and ${dto.blockReceiverId}`);
            throw new BadRequestException('no friendship in db');
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
        @UserCreds() username: string,
        @Param('id', ParseIntPipe) id: number
    ): Promise<UpdateResult>/* no */ {
        if (username == null) {
            this.userLogger.error(`Request user is not logged in`);
            throw new UnauthorizedException('user not logged in');
        }
        const me = await this.userService.findAllUsers(
            {
                "filter": { "username": [username] }
            });
        if (me === null) {
            this.userLogger.error(`User with login ${username} not found in database`);
            throw new BadRequestException('no user in db');
        }
        return await this.blockService.unblockFriend(me[0].id, id);
    }
}
