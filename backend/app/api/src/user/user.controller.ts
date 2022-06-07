import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from './user.entity'
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor (
		private readonly userService : UserService
	) {}

	@Get()
	async all() : Promise<User[]> {
		return await this.userService.findAll();
	}

	@Get(':id')
	async one( @Param('id') id : string ) : Promise<User> {
		return await this.userService.findOne( id );
	}

	@Post()
	async create ( @Body() user : UserDto ) : Promise<User> {
		return await this.userService.create( user );
	}

	@Delete(':id')
	async remove( @Param('id') id : string ) : Promise<void> {
		return await this.userService.remove(id);
	}
}
