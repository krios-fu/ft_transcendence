import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { isBoolean, isString } from 'class-validator';
import { UserQueryDto } from './user.query.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: UserRepository,
        private userMapper: UserMapper
    ) { }

    async findAllUsers(queryParams: UserQueryDto): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async findOne(id: number): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: {
                id: id
            }
        });
    }

    public async findOneByUsername(username: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ 
            where: { username: username },
        });
        return user;
    }

    /* post new user */
    async postUser(newUser: CreateUserDto): Promise<UserEntity> {
        const newEntity = this.userMapper.toEntity(newUser);

        await this.userRepository.insert(newEntity);
        return newEntity;
    }

    /*
    **  Do not need to query the database to check for existing nickname
    **  because nickname column is set as unique at user.entity.
    **
    **  Determine if value checks of keys are necessary.
    */

    async updateUser(id: number, data: Object): Promise<UpdateResult> {
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

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

}
