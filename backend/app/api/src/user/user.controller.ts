import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
} from '@nestjs/common';
import { UserPwEntity } from './user.pw.entity';
import { UserPwDto } from './user.pw.dto';
import { UserServices } from './user.service';

@Controller('user')
export class UserController {
    constructor(
	private userServices: UserServices,
    ) { }
    
    @Get()
    getAllUsers(): Promise<UserPwEntity[]> {  /* async ?? */
	return this.userServices.getAllUsers();
    }

    @Get(':id')
    getUserById(@Param() params): Promise<UserPwEntity> {
	return this.userServices.getUserById(params.id);
    }

    @Post()
    postUser(@Body() userPwDto: UserPwDto): Promise<UserPwEntity> {
	console.log("Got into post method" + userPwDto);
	return this.userServices.postUser(userPwDto);
    }

    @Delete(':id')
    removeUser(@Param() params): Promise<void> {
	return this.userServices.removeUser(params.id);
    }
}
