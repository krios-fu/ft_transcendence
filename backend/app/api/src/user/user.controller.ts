import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    Patch
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';
import { UpdateResult } from 'typeorm';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
    ) { }

    @Get()
    async findAllUsers(): Promise<UserEntity[]> {
        return this.userService.findAllUsers();
    }

    @Get(':id')
    async findOneUser(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.findOne(id);
    }

    @Post('new')
    async postUser(@Body() newUser: UserDto): Promise<UserEntity> {
        return this.userService.postUser(newUser);
    }

    /*
    **  It can only change a user's:
    **      - photoUrl
    **      - nickname
    **      - doubleAuth (boolean)
    **      - status (ONLINE, OFFLINE, PLAYING
    */

    @Patch(':id')
    async updateUser( @Param('id') id: string, @Body() body: Object)
                    : Promise<UpdateResult> {
        return this.userService.updateUser(id, body);
    }

    @Delete(':id')
	async remove( @Param('id') id: string ): Promise<void> {
		return this.userService.deleteUser(id);
	}

}
