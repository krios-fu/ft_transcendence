import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';
import {
    Injectable,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { isBoolean, isString } from 'class-validator';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: UserRepository,
        private userMapper: UserMapper
    ) { 
        this.userLogger = new Logger(UserService.name);
    }
    private readonly userLogger: Logger;

    async findAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async findOne(id: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: {
                username: id
            }
        });
        if (user === null) {
            this.userLogger.error('User with id ' + id + ' not found in database');
        }
        return user;
    }

    /* post new user */
    async postUser(newUser: UserDto): Promise<UserEntity> {
        const newEntity = this.userMapper.toEntity(newUser);

        try {
            await this.userRepository.insert(newEntity);
        } catch (err) {
            this.userLogger.error('User with id ' + newUser.username + ' already exists in database');
            throw new HttpException('User already exists',
                                    HttpStatus.BAD_REQUEST);
        }
        return newEntity;
    }

    /*
    **  Do not need to query the database to check for existing nickname
    **  because nickname column is set as unique at user.entity.
    **
    **  Determine if value checks of keys are necessary.
    */

    async updateUser(id: string, data: Object): Promise<UpdateResult> {
        const   validData = new Set();

        for (let [key, value] of Object.entries(data)) {
            if (
                (( key === "photoUrl" && isString(value) )
                    || ( key === "nickName" && isString(value) )
                    || ( key === "doubleAuth" && isBoolean(value) )
                    || ( key === "status"
                        && (value === "online"
                            || value === "offline"
                            || value === "playing") ))
                && validData.has(key) == false
            )
                validData.add(key);
            else
                return new UpdateResult();
        }
        return await this.userRepository.update(id, data);
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
