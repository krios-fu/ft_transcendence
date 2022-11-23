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
import { FriendDto } from './dto/friendship.dto';
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
    ** Find all users registered into
    ** the the app.
    */

    @Get()
    async findAllUsers(@Query() queryParams: UserQueryDto): Promise<UserEntity[]> {
        return this.userService.findAllUsers(queryParams);
    }

    /*
    **
    **
    */

    @Get('me')
    public async findMe(@Req() req: IRequestUser) {
        if (req.username === undefined) {
            this.userLogger.error('Cannot find username for client in request body');
            throw new HttpException('user has no valid credentials', HttpStatus.BAD_REQUEST);
        }
        return await this.userService.findAllUsers({ "filter": { "username": [req.username] } });
    }

    /*
    **
    **
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

    /* Get all friends from user */
    @Get(':id/friends')
    async getFriends(@Req() req: IRequestUser): Promise<FriendDto[]> {
        return this.friendshipService.getFriends(req.username);
    }

    /* Get one friend from user by id */
    @Get(':id/friends/:id')
    async getOneFriend( @Req() req: IRequestUser, @Param('id') id: string )
                        : Promise<FriendDto> {
        return this.friendshipService.getOneFriend(req.username, id);
    }

    /* Create a new friendship */
    @Post(':id/friends')
    async postFriend( @Req() req: IRequestUser, @Param('id') id: string )
                        : Promise<FriendshipEntity> {
        return this.friendshipService.addFriend(req.username, id);
    }

    /*
    **  Changes a friendship's status from PENDING to CONFIRMED
    **  if username of the request matches the receiverId in friendship.
    */
   
    @Patch(':user_id/friends/:friend_id/accept/')
    async acceptFriend( @Req() req: IRequestUser, @Param('id') id: string )
                        : Promise<UpdateResult> {
        return this.friendshipService.acceptFriend(req.username, id);
    }

    /*
    **  Changes a friendship's status from PENDING to REFUSED
    **  if username of the request matches the receiverId in friendship.
    */

    @Patch('refuse/:id')
    async refuseFriend( @Req() req: IRequestUser, @Param('id') id: string )
                        : Promise<UpdateResult> {
        return this.friendshipService.refuseFriend(req.username, id);
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
            this.userLogger.error('User with id ' + newUser.username + ' already exists in database');
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
    public async updateUser( @Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto)
                    : Promise<UpdateResult> {
        return this.userService.updateUser(id, body);
    }

    @Patch(':id/settings')
    public async updateSettings(
        @Body() settingsDto: SettingsPayloadDto,
        @Param(':id', ParseIntPipe) userId: number
    ): Promise<UserEntity> {
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
