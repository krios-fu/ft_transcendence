import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    Req
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';
import { FriendshipEntity } from './friendship/friendship.entity';
import { FriendDto } from './friendship/friendship.dto';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
    ) {
        console.log("UserController inicializado");
    }

    @Get()
    async findAllUsers(): Promise<UserEntity[]> {
        return this.userService.findAllUsers();
    }

    @Get('friends')
    async getFriends(@Req() req): Promise<FriendDto[]> {
        const   friends = await this.userService.getFriends(req.user.username);

        return friends;
    }

    @Get(':id')
    async findOneUser(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.findOne(id);
    }

    @Post('new')
    async postUser(@Body() newUser: UserDto): Promise<UserEntity> {
        return this.userService.postUser(newUser);
    }

    @Delete(':id')
	async remove( @Param('id') id : string ): Promise<void> {
		return await this.userService.deleteUser(id);
	}

    @Post('friends')
    async postFriend(@Req() req, @Body('friendId') friendId : string )
        : Promise<FriendshipEntity> {
        const friendship = await this.userService.addFriend(req.user.username,
            friendId);
    
        return friendship;
    }

}
