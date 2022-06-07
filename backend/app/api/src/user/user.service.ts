import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserDto } from './user.dto';
import { User, UserStatus } from './user.entity';


@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private readonly repository : Repository<User>
	){}

	async findAll() : Promise <User[]> {
		return await this.repository.find();
	}

	async findOne( id : string ) : Promise<User> {
		return await this.repository.findOne( id );
	}

	async create ( newUser : UserDto ) : Promise<User> {
		const user = new User();

		user.username = newUser.username;
		user.firstName = newUser.firstName;
		user.lastName = newUser.lastName;
		user.email = newUser.email;
		user.photo = newUser.photo;
		user.nickName = user.username;
		return await this.repository.save( user );
	}

	async remove( id : string ) : Promise<void> {
		await this.repository.delete( id );
	}

	//Custom Services

	async changeNick( id : string, newNick : string ) : Promise<UpdateResult> {
		return await this.repository.update(id, { nickName: newNick });
	}

	async updateStatus( id : string,
											newStatus : UserStatus ) : Promise<UpdateResult> {
		return await this.repository.update(id, { status: newStatus });
	}

}
