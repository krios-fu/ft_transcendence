import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';
import {
    Injectable,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: UserRepository,
        private userMapper: UserMapper,
    ) {
        console.log("UsersService inicializado");
    }

    async findAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async findOne(id: string): Promise<UserEntity> {
        const usr = await this.userRepository.findOne(id);
        return usr;
    }

    /* post new user */
    async postUser(newUser: UserDto): Promise<UserEntity> {
        const isInDb = this.findOne(newUser.username);

        if (Object.keys(isInDb).length) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        const newEntity = this.userMapper.toEntity(newUser);

        this.userRepository.save(newEntity);
        return newEntity;
    }

    /*
    **  Delete user by name.
    **
    **  Determine which type of repository method is most appropriate,
    **  delete or remove.
    */
    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

}
