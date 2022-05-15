import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor ( private userService : UserService) {}

	@Get()
	async all() : Promise<UserDto[]>{
		return await this.userService.findAll();
	}

	@Get(':id')
	async one( @Param('id') id : string ) : Promise<UserDto>{
		return await this.userService.findOne( id );
	}

	@Post()
	async create ( @Body() user : UserDto ) : Promise<UserDto>{
		return await this.userService.create( user );
	}

	@Delete(':id')
	async remove( @Param('id') id : string ) : Promise<void>{

		return await this.userService.remove(id);
	}
}
