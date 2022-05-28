import { UsersRepository } from './users.repository';
import { UsersMapper } from './users.mapper';
import { UsersEntity } from './users.entity';
import { UsersDto } from './users.dto';
import {
    Injectable,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

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
        const isInDb = this.usersRepository.findOne(newUser.username);
        if (isInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
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
