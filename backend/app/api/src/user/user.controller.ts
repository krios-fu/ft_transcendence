import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';

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

    @Get(':id')
    async findOneUser(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.findOne(id);
    }

    @Post('new')
    async postUser(@Body() newUser: UserDto): Promise<UserEntity> {
        return this.userService.postUser(newUser);
    }

    @Delete(':id')
	async remove( @Param('id') id : string ) : Promise<void> {
		return await this.userService.deleteUser(id);
	}

}
