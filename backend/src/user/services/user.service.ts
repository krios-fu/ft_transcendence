import { 
    CreateUserDto, 
    DoubleAuthPayload, 
    SettingsPayloadDto, 
    UpdateUserDto, 
    UserGameStats 
<<<<<<< HEAD
} from '../../user/dto/user.dto';
import { UserRepository } from '../../user/repositories/user.repository';
import { UserEntity } from '../../user/entities/user.entity';
=======
} from 'src/user/dto/user.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserEntity } from 'src/user/entities/user.entity';
>>>>>>> main
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { UserQueryDto } from '../../user/dto/user.query.dto';
import { QueryMapper } from '../../common/mappers/query.mapper';
import { IRequestUser } from '../../common/interfaces/request-payload.interface';
import * as fs from 'fs';
<<<<<<< HEAD
import { DEFAULT_AVATAR_PATH } from '../../common/config/upload-avatar.config';
=======
import { DEFAULT_AVATAR_PATH } from 'src/common/config/upload-avatar.config';
>>>>>>> main

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: UserRepository,
    ) { }

    public tmp() { console.log('hey'); }

    public async findAllUsers(queryParams?: UserQueryDto): Promise<UserEntity[]> {
        if (queryParams !== undefined) {
            return await this.userRepository.find(new QueryMapper(queryParams));
        }
        return await this.userRepository.find();
    }

    public async findAndCountAllUsers(queryParams?: UserQueryDto)
                                        : Promise<[UserEntity[], number]> {
        return await this.userRepository.findAndCount(
            new QueryMapper(queryParams)
        );
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

    public async findOneByNickName(nickName: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ 
            where: { nickName: nickName },
        });
        return user;
    }

    public async postUser(newUser: CreateUserDto): Promise<UserEntity> {
        const newEntity = new UserEntity(newUser);

        await this.userRepository.insert(newEntity);
        return newEntity;
    }

    public async updateUser(
        id: number, 
        userInfo: UpdateUserDto | UserGameStats | SettingsPayloadDto | DoubleAuthPayload
    ): Promise<UpdateResult> {
        return await this.userRepository.update(id, userInfo);
        // must return user entity
    }

    /*
    **  Delete user by name.
    **
    **  Determine which type of repository method is most appropriate,
    **  delete or remove.
    */

    public async deleteAvatar(id: number, filePath: string): Promise<void> { /* needs cleanup */
        if (filePath === DEFAULT_AVATAR_PATH) {
            throw new NotFoundException('user has no avatar uploaded');
        }
        try {
            const test = await fs.promises.access(filePath, fs.constants.W_OK);
            console.log(`[deleteAvatar] testing access return: ${test}`);
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error(`[deleteAvatar] caught exception: ${err}`);
        }
        await this.userRepository.update(id, { photoUrl: DEFAULT_AVATAR_PATH });
    }

    public async deleteUser(user: UserEntity): Promise<void> {
        const { photoUrl } = user;
        if (photoUrl !== DEFAULT_AVATAR_PATH) {
            try {
                fs.accessSync(photoUrl, fs.constants.W_OK);
                fs.unlinkSync(photoUrl);
            } catch (err) { }
        }
        await this.userRepository.remove(user);
    }

    /*
    **  ~~   [ Validation guard services ]   ~~
    **
    **  Access user_id value in param/body, compare with
    **  request user identity, return true if match
    */

    public async validateIdentity(req: IRequestUser): Promise<boolean> {
        let validate: boolean = false;
        const username = req.user.data.username;
        const userId = (req.method === 'POST') ?
            Number(req.body['user_id']) :
            Number(req.param['user_id']);

        if (username === undefined || userId !== userId) {
            return false;
        }
        this.findOne(userId).then(
            (user: UserEntity) => validate = (user.username === username)
        );
        return validate;
    }
}
