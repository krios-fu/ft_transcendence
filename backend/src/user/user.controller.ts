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
} from '@nestjs/common';
import { CreateUserDto, SettingsPayloadDto, UpdateUserDto } from './dto/user.dto';
import { UpdateResult } from 'typeorm';
import { UserQueryDto } from './dto/user.query.dto';
import { IRequestUser } from 'src/common/interfaces/request-payload.interface';
import { CreateFriendDto, FriendDto, FriendshipPayload } from './dto/friendship.dto';
import { FriendshipEntity } from './entities/friendship.entity';
import { UserService } from './services/user.service';
import { FriendshipService } from './services/friendship.service';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly friendshipService: FriendshipService,
    ) { 
        this.userLogger = new Logger(UserController.name);
    }
    private readonly userLogger: Logger;

    /*
    ** Find all users registered into the app.
    */

    @Get()
    async findAllUsers(@Query() queryParams: UserQueryDto): Promise<UserEntity[]> {
        return this.userService.findAllUsers(queryParams);
    }

    /*
    ** Get request user info.
    ** (User must be himself)
    */

    //@UseGuards(MyGuard)
    @Get('me')
    public async findMe(@Req() req: IRequestUser) {
        if (req.username === undefined) {
            this.userLogger.error('Cannot find username for client in request body');
            throw new HttpException('user has no valid credentials', HttpStatus.BAD_REQUEST);
        }
        return await this.userService.findAllUsers({ "filter": { "username": [req.username] } });
    }

    /*
    ** Find one user registered into app by id.
    */

    @Get(':id')
    async findOneUser(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        const user = await this.userService.findOne(id);
        if (user === null) {
            this.userLogger.error(`User with id ${id} not found in database`);
            throw new HttpException('no user in db', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    /*
    ** Get all friends from user
    ** (user_id must be my id or I need to be an admin)
    */

    @Get(':user_id/friends')
    async getFriends(@Param('user_id', ParseIntPipe) userId: number): Promise<FriendshipEntity[]> {
        return await this.friendshipService.getFriends(userId);
    }

    /*
    ** Get my friends (I must be me)
    */

    @Get('me/friends')
    public async getMyFriends(@Req() req: IRequestUser): Promise<FriendshipEntity[]> {
        const username = req.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(req.username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }
        return await this.friendshipService.getFriends(user.id);
    }

    /* 
    ** Get one friend from user by id
    */

    @Get(':user_id/friends/:friend_id')
    async getOneFriend( 
        @Req() req: IRequestUser, 
        @Param('friend_id', ParseIntPipe) friendId: number 
    ): Promise<FriendshipEntity> {
        const username = req.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(req.username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }
        return this.friendshipService.getOneFriend(user.id, friendId);
    }

    /* Create a new friendship */
    // @UseGuards(Myself)
    @Post(':user_id/friends')
    async postFriend( 
        @Req() req: IRequestUser, 
        @Param('user_id', ParseIntPipe) userId: number,
        @Body() dto: FriendshipPayload,
    ): Promise<FriendshipEntity> {
        const username = req.username;
        if (username === undefined) {
            this.userLogger.error('request user has not logged in');
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        const user = await this.userService.findOneByUsername(req.username);
        if (user === null) {
            this.userLogger.error(`User with login ${username} not present in database`);
            throw new HttpException('user not found in database', HttpStatus.BAD_REQUEST);
        }
        if (await this.userService.findOne(userId) === null) {
            this.userLogger.error(`No user with id ${userId} in database`);
            throw new HttpException('no user in db', HttpStatus.BAD_REQUEST);
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
        if ((await this.userService.findAllUsers({ filter: { id: [ userId, friendId ] } }))
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
        if ((await this.userService.findAllUsers({ filter: { id: [ userId, friendId ] } }))
            .length != 2) {
            this.userLogger.error(`No user pair {${userId}, ${friendId}} found in database`);
            throw new HttpException('user not found in db', HttpStatus.BAD_REQUEST);
        }
        return this.friendshipService.refuseFriend(userId, friendId);
    }

    /*
    **  IMPORTANT!
    **
    **  A Friendship is deleted only when at least one of the two users'
    **  account is deleted. No matter the status of the friendship.
    **
    **  Therefore, no @Delete route for /users/friends is provided.
    */

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

    @Patch(':id/settings')
    public async updateSettings(
        @Body() settingsDto: SettingsPayloadDto,
        @Param(':id', ParseIntPipe) userId: number
    ): Promise<UpdateResult> {
        const user = this.userService.findOne(userId);
        if (user === null) {
            this.userLogger.error(`User with id ${userId} not found in database`);
            throw new HttpException('no user in database', HttpStatus.BAD_REQUEST);
        }
        return this.userService.updateSettings(userId, settingsDto);
    } 

    /* it is me! (or admin) */
    @Delete(':id')
	public async remove( @Param('id', ParseIntPipe) id: number ): Promise<void> {
		return this.userService.deleteUser(id);
	} 
}
