import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserMapper } from './user.mapper';
import { UserDto } from './user.dto';


@Injectable()
export class UsersRepository {

	constructor(
		@InjectRepository( User )
		private repository: Repository<User>,
		private map : UserMapper
	){}

	findAll() : Promise<User[]> {
		return this.repository.find();
	}

	create ( newUser : UserDto ) : Promise< User > {

		const user = this.map.ToEntity( newUser );
		return this.repository.save( user );
	}

	findOne( id : string ) : Promise<User> { 
		return this.repository.findOne( id );
	}

	async remove( id : string ) : Promise<void> {
		await this.repository.delete( id );
	}
}
