import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersMapper } from './users.mapper';
import { UsersEntity } from './users.entity';
import { UsersDto } from './users.dto';

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        private usersMapper: UsersMapper,
    ) {
        console.log("UsersService inicializado");
    }

    /* find all */
    async findAllUsers(): Promise<UsersEntity[]> {
        return await this.usersRepository.find();
    }

    /* find one user by name*/
    async findByUsername(username: string): Promise<UsersEntity> {
        return await this.usersRepository.findByUsername(username);
    }

    /* post new user */
    async postUser(newUser: UsersDto): Promise<UsersEntity> {
        const newEntity = this.usersMapper.toEntity(newUser);

        this.usersRepository.create(newEntity);
        return newEntity;
    }

    /* delete user by name */
    async deleteUser(toRemove: UsersDto): Promise<void> {
        await this.usersRepository.remove(this.usersMapper.toEntity(toRemove));
    }

    // clear all
}
