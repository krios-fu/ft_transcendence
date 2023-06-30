import { 
    CreateUserDto, 
    DoubleAuthPayload, 
    SettingsPayloadDto, 
    UpdateUserDto, 
    UserGameStats 
} from 'src/user/dto/user.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, UpdateResult } from 'typeorm';
import { UserQueryDto } from 'src/user/dto/user.query.dto';
import { QueryMapper } from 'src/common/mappers/query.mapper';
import { IRequestUser } from 'src/common/interfaces/request-payload.interface';
import * as fs from 'fs';
import { DEFAULT_AVATAR_PATH } from '../../common/config/upload-avatar.config';
import { UserCountData } from '../types/user-count-data.type';
import { extname } from 'path';
import { StaticDir } from '../../common/constants/static-dir.const';

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

    private async   _findUserRanking(queryParams: UserQueryDto)
                                        : Promise<UserCountData> {
        let queryMapper: QueryMapper;
        let targetUser: UserEntity;
        let result: UserCountData;
    
        queryParams.offset = 0;
        while (true) {
            queryMapper = new QueryMapper(queryParams);
            result = await this.userRepository.findAndCount(queryMapper);
            if (!result[0].length)
                break ;
            targetUser = result[0].find((user: UserEntity) => {
                return (user.username === queryParams.target)
            });
            if (targetUser
                    || !queryParams.limit)
                break ;
            queryParams.offset += queryParams.limit;
        }
        return ([result[0], result[1], queryParams.offset]);
    }

    public async findAndCountAllUsers(queryParams?: UserQueryDto)
                                        : Promise<UserCountData> {
        let result: UserCountData;
    
        if (queryParams.orderDesc
                && queryParams.orderDesc.includes('ranking')
                && queryParams.target) {
            try {
                if (!await this.findOneByUsername(queryParams.target))
                    result = [[], 0];
                else
                    result = await this._findUserRanking(queryParams);
            } catch(err: any) {
                console.error(err);
                throw new InternalServerErrorException();
            }
            if (!result[0].length)
                throw new BadRequestException("Target user data not found.");
            return (result);
        }
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
        const user: UserEntity = await this.userRepository.findOne({
            where: { username: username },
        });
        return user;
    }

    public async findOneByNickName(nickName: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({
            where: { nickName: nickName },
        });
        return user;
    }

    public async postUser(newUser: CreateUserDto): Promise<UserEntity> {
        const newEntity: UserEntity = new UserEntity(newUser);

        await this.userRepository.insert(newEntity);
        return newEntity;
    }

    public async updateUser(
        id: number, 
        userInfo: UpdateUserDto | UserGameStats | SettingsPayloadDto | DoubleAuthPayload,
        qR?: QueryRunner
    ): Promise<UserEntity> {
        if (qR)
            await qR.manager.getRepository(UserEntity).update(id, userInfo);
        else
            await this.userRepository.update(id, userInfo);
        return await this.findOne(id);
    }

    public async    removeAvatarFile(username: string,
                                        avatarUrl: string): Promise<void> {
        let filePath: string;
    
        if (!username
                || !avatarUrl)
            return ;
        filePath = StaticDir.Users + username + extname(avatarUrl);
        if (!!(await fs.promises.stat(filePath).catch(() => false)))
            fs.promises.unlink(filePath);
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
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error(`[deleteAvatar] caught exception: ${err}`);
        }
        await this.userRepository.update(id, { photoUrl: DEFAULT_AVATAR_PATH });
    }

    public async deleteUser(user: UserEntity): Promise<void> {
        const { id, photoUrl } = user;

        // if user was a room owner, call service that actualizes new owner
        if (photoUrl !== DEFAULT_AVATAR_PATH) {
            try {
                fs.accessSync(photoUrl, fs.constants.W_OK);
                fs.unlinkSync(photoUrl);
            } catch (err) { }
        }
        await this.userRepository.remove(user);
    }

    public async getUsersInRoom(roomId: number): Promise<UserEntity[]> {
        return (await this.userRepository.createQueryBuilder('user'))
            .leftJoinAndSelect(
                'user.userRoom',
                'user_room',
                'user_room.room_id = :room_id',
                { 'room_id': roomId }
            )
            .orderBy('user_room.createdAt', 'ASC')
            .getMany();
    }

    public async getAdminsInRoom(roomId: number): Promise<UserEntity[]> {
        return await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.userRoom', 'user_room')
            .leftJoinAndSelect('user_room.userRoomRole', 'user_room_roles')
            .leftJoinAndSelect('user_room_roles.role', 'roles')
            .where('user_room.room_id = :room_id', {'room_id': roomId})
            .andWhere('roles.role = :role', {'role': 'administrator'})
            .orderBy('user_room_roles.createdAt', 'ASC')
            .getMany();
    }

    public async findAllUsersWithAchievement(id: number): Promise<UserEntity[]> {
        return await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.achievementUser', 'achievement_user')
            .where('achievement_user.achievementId = :achvId', { 'achvId': id })
            .getMany();
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
