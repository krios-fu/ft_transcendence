import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserPwEntity } from './user.pw.entity';
import { UserPwMapper } from './user.pw.mapper';
import { UserPwDto } from './user.pw.dto';
import { InjectRepository } from '@nestjs/typeorm';

/* Función que espera una Promesa no debería ser siempre asíncrona ? */

@Injectable()
export class UserServices {
    constructor(
	@InjectRepository(UserPwEntity)
	private userPwRepository: Repository<UserPwEntity>,
	private userPwMapper: UserPwMapper,
    ) { }

    async getAllUsers(): Promise<UserPwEntity[]> {  /* async ?? */
	return await this.userPwRepository.find();
    }

    async getUserById(id: string): Promise<UserPwEntity> {
	return await this.userPwRepository.findOne(id);
    }

    async postUser(newUser: UserPwDto): Promise<UserPwEntity> {
	const newUserEntity = this.userPwMapper.toEntity(newUser);
	
	await this.userPwRepository.save(newUserEntity);
	return newUserEntity;
    }

    async removeUser(id: string): Promise<void> {
	await this.userPwRepository.delete(id);
    }
}
