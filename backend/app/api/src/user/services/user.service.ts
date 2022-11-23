import { UserRepository } from './repository/user.repository';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto, SettingsPayloadDto } from './dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { isBoolean, isString } from 'class-validator';
import { UserQueryDto } from './dto/user.query.dto';
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
    async postUser(newUser: CreateUserDto): Promise<UserEntity> {
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

    public async updateSettings(userId: number, dto: SettingsPayloadDto): Promise<UserEntity> {
        this.userRepository.update();
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
