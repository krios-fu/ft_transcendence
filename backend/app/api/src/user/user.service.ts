import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { UserMapper } from './user.mapper';
import { UsersRepository } from './users.repository';


@Injectable()
export class UserService {

	constructor(
		private repository : UsersRepository ,
		private userMap : UserMapper
	){}

	async findAll() : Promise <UserDto []>{
		const users : User[] = await this.repository.findAll();
		return users.map( users => this.userMap.ToDto(users) )
	}

	async findOne( id : string ) : Promise<UserDto>{
		const user : User = await this.repository.findOne( id );
		return this.userMap.ToDto( user );
	}

	async create ( newUser : UserDto ) : Promise<UserDto>{ 
		const user : User = await this.repository.create( newUser );
		return this.userMap.ToDto( user );
	}

	async remove( id :string ) : Promise<void>{
		await this.repository.remove( id );
	}
}
