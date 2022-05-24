import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserMapper } from './user.mapper';
import { UserDto } from './user.dto';

/* Función que espera una Promesa no debería ser siempre asíncrona ? */

@Injectable()
export class UserServices {
    constructor(
	private userRepository: Repository<UserEntity>,
	private userMapper: UserMapper,
    ) { }

    getAllUsers(): Promise<UserEntity[]> {
	return this.userRepository.find();
    }

    getUserById(id: string): Promise<UserEntity> {
	return this.userRepository.findOne(id);
    }

    async postUser(newUser: UserDto): Promise<UserEntity> {
	const newUserEntity = this.userMapper.toEntity(newUser);
	
	await this.userRepository.save(newUserEntity);
	return newUserEntity;
    }

    async removeUser(id: string): Promise<void> {
	await this.userRepository.delete(id);
    }
}
