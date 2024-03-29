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
    BadRequestException,
    NotFoundException,
    HttpCode,
    UnauthorizedException,
    UseGuards,
    ForbiddenException
} from '@nestjs/common';
import { CreateUserDto, SettingsPayloadDto, UpdateUserDto } from './dto/user.dto';
import { UpdateResult } from 'typeorm';
import { UserQueryDto } from './dto/user.query.dto';
import { BlockPayloadDto, CreateFriendDto, FriendshipPayload } from './dto/friendship.dto';
import { FriendshipEntity } from './entities/friendship.entity';
import { UserService } from './services/user.service';
import { FriendshipService } from './services/friendship.service';
import { UserEntity } from './entities/user.entity';
import { BlockService } from './services/block.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidatorPipe } from 'src/common/validators/filetype-validator.class';
import { UserCreds } from 'src/common/decorators/user-cred.decorator';
import { uploadUserAvatarSettings } from 'src/common/config/upload-avatar.config';
import { Express } from 'express';
import { UserCredsDto } from 'src/common/dtos/user.creds.dto';
import { UserCountData } from './types/user-count-data.type';
import { SiteAdminGuard } from 'src/user_roles/guard/site-admin.guard';
import { BlockEntity } from "./entities/block.entity";

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
    async findAllUsers(@Query() queryParams: UserQueryDto): Promise<UserEntity[] | UserCountData> {
        if (queryParams.count)
            return await this.userService.findAndCountAllUsers(queryParams);
        return await this.userService.findAllUsers(queryParams);
    }

    /*
    ** Get request user info.
    ** (User must be himself)
    */

    @Get('me')
    public async findMe(@UserCreds() userCreds: UserCredsDto) {
        const { username } = userCreds;

        return await this.userService.findOneByUsername(username);
    }

    /*
    ** Find one user registered into app by id (regex: param must be a number).
    */

    @Get(':id([0-9]+)')
    async findOneUser(@Param('id', ParseIntPipe) id: number,
        @UserCreds() userCreds: UserCredsDto
    ): Promise<UserEntity> {
        const user: UserEntity = await this.userService.findOne(id);

        const users_blocked = await this.getBlockedFriends(userCreds);

        // users_blocked.forEach((blocked: FriendshipEntity) => {
        //     if (user && blocked && blocked.senderId === user.id) {
        //         this.userLogger.error(`User with login ${userCreds.username} is blocked by ${user.username}`);
        //         throw new ForbiddenException('You are blocked');
        //     }
        // })

        if (user === null) {
            this.userLogger.error(`User with id ${id} not found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return user;
    }

    /*
    ** Find one user registered into the app by username.
    ** (regex: param must be only ascii characters).
    */

    @Get(':id([a-z][a-z0-9-]{2,10})')
    public async findOneUserByUsername(@Param('id') id: string,
        @UserCreds() userCreds: UserCredsDto
    ): Promise<UserEntity> {
        const user: UserEntity = await this.userService.findOneByUsername(id);

        // const users_blocked = await this.getBlockedFriends(userCreds);

        // users_blocked.forEach((blocked: FriendshipEntity) => {
        //     if ( user && blocked && blocked.senderId === user.id) {
        //         this.userLogger.error(`User with login ${userCreds.username} is blocked by ${user.username}`);
        //         throw new ForbiddenException('You are blocked');
        //     }
        // })

        if (user === null) {
            this.userLogger.error(`User with login ${id} not found in database`);
            throw new NotFoundException('resource not found exists in database');
        }
        return user;
    }

    @UseGuards(SiteAdminGuard)
    @Post()
    async postUser(@Body() newUser: CreateUserDto): Promise<UserEntity> {
        if (await this.userService.findOneByUsername(newUser.username) !== null) {
            this.userLogger.error(`User with id ${newUser.username} already exists in database`);
            throw new BadRequestException('resource already exists');
        }
        return await this.userService.postUser(newUser);
    }


    /*
    **  It can only change a user's:
    **      - photoUrl
    **      - nickname
    **      - doubleAuth (boolean)
    */

    //    @UseGuards(SiteAdminGuard)
    //    @Patch(':id')
    //    public async updateUser(
    //        @Param('id', ParseIntPipe) id: number,
    //        @Body() dto: UpdateUserDto
    //    ): Promise<UserEntity> {
    //        if (await this.userService.findOne(id) === null) {
    //            this.userLogger.error(`User with login ${id} not found in database`);
    //            throw new NotFoundException('resource does not exists in database');
    //        }
    //        await this.userService.updateUser(id, dto);
    //        return await this.userService.findOne(id);
    //    }

    @Patch('me')
    public async updateMeUser(
        @Body() dto: UpdateUserDto,
        @UserCreds() userCreds: UserCredsDto
    ): Promise<UserEntity> {
        const { username } = userCreds;
        const user = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        await this.userService.updateUser(user.id, dto);
        return await this.userService.findOne(user.id);
    }

    @Patch('me/settings')
    public async updateSettings(
        @Body() settingsDto: SettingsPayloadDto,
        @UserCreds() userCreds: UserCredsDto
    ): Promise<UserEntity> {
        const { username } = userCreds;
        const user = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        if (user === null) {
            this.userLogger.error(`User with id ${user.id} not found in database`);
            throw new BadRequestException('resource not found in database');
        }
        return await this.userService.updateUser(user.id, settingsDto);
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
        @UserCreds() userCreds: UserCredsDto,
        @Req() req: Request
    ): Promise<UserEntity> {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }

        const   path = String(avatar.path);
        const   photoUrl = path.substring(("dist").length);
        
        if (user.photoUrl !== photoUrl)
            await this.userService.removeAvatarFile(user.username, user.photoUrl);
        return await this.userService.updateUser(user.id, { photoUrl: photoUrl });
    }

    /*
    ** Same as above, gives access to avatar posting to site admin.
    */


    /*
    **  Remove an avatar previously uploaded by user.
    **  (what if user has no uploaded avatar but is still working with default provided by 42??)
    **  (what if user removes custom avatar? do we return to default one? is there a default avatar??)
    **/

    @Delete('me/avatar')
    @HttpCode(204)
    public async deleteMyAvatar(@UserCreds() userCreds: UserCredsDto): Promise<void> {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        const { id, photoUrl } = user;
        return await this.userService.deleteAvatar(id, photoUrl);
    }

    @UseGuards(SiteAdminGuard)
    @Delete(':id')
    @HttpCode(204)
    public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        const user = await this.userService.findOne(id);

        if (user === null) {
            this.userLogger.error(`User with id ${id} not found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userService.deleteUser(user);
    }

    @Delete('/me')
    @HttpCode(204)
    public async removeMe(@UserCreds() userCreds: UserCredsDto): Promise<void> {
        const { id } = userCreds;
        const user: UserEntity = await this.userService.findOne(id);

        if (user === null) {
            this.userLogger.error(`User with id ${id} not found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userService.deleteUser(user);
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **
    **                                               **
    **           ( friendship endpoints )            **
    **                                               **
    ** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

    /*
    ** Get all friends from user
    */

    @Get('me/friends')
    public async getMyFriends(@UserCreds() userCreds: UserCredsDto): Promise<FriendshipEntity[]> {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        return await this.friendshipService.getFriends(user.id);
    }

    @Get(':id/friends')
    public async getUserFriends(@Param('id', ParseIntPipe) id: number): Promise<FriendshipEntity[]> {

        return await this.friendshipService.getFriends(id);
    }

    @Get('me/friends/as_pending')
    public async getFriendsAsPendding(@UserCreds() userCreds: UserCredsDto): Promise<FriendshipEntity[]> {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        return await this.friendshipService.getPossibleFriends(user.id);
    }

    /* 
    ** Get one friend from user by id
    */

    @Get('me/friends/:friend_id')
    public async getOneFriend(
        @UserCreds() userCreds: UserCredsDto,
        @Param('friend_id', ParseIntPipe) friendId: number
    ): Promise<FriendshipEntity> {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        return this.friendshipService.getOneFriend(user.id, friendId);
    }

    @Get('me/friends/:friend_id/blocked')
    public async getOneFriendBlocked(
        @UserCreds() userCreds: UserCredsDto,
        @Param('friend_id', ParseIntPipe) friendId: number
    ): Promise<FriendshipEntity> {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        return this.friendshipService.getOneFriendBlocked(user.id, friendId);
    }

    /* 
    ** Create a new friendship for requesting user.
    ** User ID must be read from credentials in request.
    */

    @Post('me/friends')
    async postFriend(
        @UserCreds() userCreds: UserCredsDto,
        @Body() dto: FriendshipPayload,
    ): Promise<FriendshipEntity> {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('resource not found in database');
        }
        return this.friendshipService.addFriend(new CreateFriendDto(user.id, dto));
    }

    /*
    **  Changes a friendship's status from PENDING to CONFIRMED
    **  if username of the request matches the receiverId in friendship.
    */

    @Patch('me/friends/:friend_id/accept')
    public async acceptFriend(
        @UserCreds() userCreds: UserCredsDto,
        @Param('friend_id', ParseIntPipe) friendId: number,
    ): Promise<UpdateResult> { // TODELETE
        const { username } = userCreds;
        const { id: userId } = await this.userService.findOneByUsername(username);
        if ((await this.userService.findAllUsers({ filter: { id: [userId, friendId] } }))
            .length != 2) {
            this.userLogger.error(`No user pair {${userId}, ${friendId}} found in database`);
            throw new BadRequestException('resource not found in database');
        }
        return this.friendshipService.acceptFriend(userId, friendId);
    }

    @Patch('me/friends/accept')
    public async meAcceptFriend(
        @UserCreds() userCreds: UserCredsDto,
        @Body() friend: any
    ): Promise<UpdateResult> { // TODELETE
        const { username } = userCreds;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new UnauthorizedException('request user has not logged in');
        }
        const user = await this.userService.findOneByUsername(username);
        const userId = user.id;
        const friendId = friend.id;
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
        @UserCreds() userCreds: UserCredsDto,
    ) {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

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
        @UserCreds() userCreds: UserCredsDto,
        @Param('friend_id', ParseIntPipe) friendId: number,
    ): Promise<UpdateResult> {
        const { username } = userCreds;
        const user: UserEntity = await this.userService.findOneByUsername(username);

        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new BadRequestException('user not found in database');
        }
        const { id: userId } = user;
        if ((await this.userService.findAllUsers({ filter: { id: [userId, friendId] } }))
            .length != 2) {
            this.userLogger.error(`No user pair {${userId}, ${friendId}} found in database`);
            throw new BadRequestException('resource not found in database');
        }
        return this.friendshipService.refuseFriend(userId, friendId);
    } /* should not return updateResult */

    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ **
    **                                               **
    **              ( block endpoints )              **
    **                                               **
    ** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


    @Get('me/blocked')
    public async getBlockedFriends(@UserCreds() userCreds: UserCredsDto): Promise<FriendshipEntity[]> {
        const { username } = userCreds;
        const me: UserEntity = await this.userService.findOneByUsername(username);

        if (me === null) {
            this.userLogger.error(`User with login ${username} not found in database`);
            throw new BadRequestException('resource not found in database');
        }
        return this.blockService.getBlockedFriends(me.id);
    }

    /*
    **  Changes a friendship's status from CONFIRMED to BLOCKED,
    **  and adds a row in BlockEntity table.
    */

    @Post('me/blocked')
    async blockFriend(
        @UserCreds() userCreds: UserCredsDto,
        @Body() dto: BlockPayloadDto,
    ): Promise<BlockEntity> {
        const { username } = userCreds;
        const me: UserEntity = await this.userService.findOneByUsername(username);
        let friendship: FriendshipEntity;

        if (!me) {
            this.userLogger.error(`User with username ${username} not found in database`);
            throw new BadRequestException('resource not found in database');
        }
        friendship = await this.friendshipService.getOneFriend(me.id, dto.blockReceiverId);

        if (!friendship)
            friendship = await this.friendshipService.getPosibleFriend(me.id, dto.blockReceiverId);
        if (!friendship) {
            friendship = await this.friendshipService.addFriend({
                senderId: me.id,
                receiverId: dto.blockReceiverId
            });
            if (!friendship) {
                throw new BadRequestException('se pudrió la cosa');
            }
        }
        return this.blockService.blockFriend({
            'friendshipId': friendship.id,
            'blockSenderId': me.id
        });
    }

    /*
    **  The friendship blocker requests to unblock the friendship.
    */

    @Delete('me/blocked/:id')
    @HttpCode(204)
    public async unblockFriend(
        @UserCreds() userCreds: UserCredsDto,
        @Param('id', ParseIntPipe) friendId: number
    ): Promise<void> {
        const { id } = userCreds;
        let block: FriendshipEntity;

        if (!(await this.userService.findOne(id))) {
            this.userLogger.error(`User with id ${id} not found in database`);
            throw new BadRequestException('resource not found in database');
        }
        block = await this.friendshipService.getOneBlock(id, friendId);
        if (!block) {
            this.userLogger.error('User is not blocked');
            throw new NotFoundException('Resource not found')
        }
        await this.blockService.unblockFriend(block);
    }
}
