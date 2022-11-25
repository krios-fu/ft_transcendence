import { UserRepository } from 'src/user/repositories/user.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto, SettingsPayloadDto, UpdateUserDto } from 'src/user/dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { isBoolean, isString } from 'class-validator';
import { UserQueryDto } from 'src/user/dto/user.query.dto';
import { QueryMapper } from 'src/common/mappers/query.mapper';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: UserRepository,
    ) { }

    public async findAllUsers(queryParams?: UserQueryDto): Promise<UserEntity[]> {
        if (queryParams !== undefined) {
            return await this.userRepository.find(new QueryMapper(queryParams));
        }
        return await this.userRepository.find();
    }

    public async findOne(userId: number): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: {
                id: userId
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
    public async postUser(newUser: CreateUserDto): Promise<UserEntity> {
        const newEntity = new UserEntity(newUser);

        await this.userRepository.insert(newEntity);
        return newEntity;
    }

    /*
    **  Do not need to query the database to check for existing nickname
    **  because nickname column is set as unique at user.entity.
    **
    **  Determine if value checks of keys are necessary.
    */

    public async updateUser(id: number, dto: UpdateUserDto): Promise<UpdateResult> {
        return await this.userRepository.update(id, dto);
    }

    public async updateSettings(userId: number, dto: SettingsPayloadDto): Promise<UpdateResult> {
        return await this.userRepository.update(userId, dto);
    }

    /*
    **  Delete user by name.
    **
    **  Determine which type of repository method is most appropriate,
    **  delete or remove.
    */

    async deleteUser(id: number): Promise<void> {
        await this.userRepository.softDelete(id);
    }

}
