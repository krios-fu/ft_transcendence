import { Injectable } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
    constructor(
	private usersRepository: Repository<UserEntity>
    ) { }
    
    getUsers(): UserEntity[] {
	
    }

    getOneUser(id: string): UserEntity {
	
    }
}
