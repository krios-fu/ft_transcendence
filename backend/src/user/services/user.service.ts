import { 
    CreateUserDto, 
    SettingsPayloadDto, 
    UpdateUserDto, 
    UserGameStats 
} from 'src/user/dto/user.dto';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { UserQueryDto } from 'src/user/dto/user.query.dto';
import { QueryMapper } from 'src/common/mappers/query.mapper';
import { IRequestUser } from 'src/common/interfaces/request-payload.interface';

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

    public async findOneByNickName(nickName: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ 
            where: { nickName: nickName },
        });
        return user;
    }

    public async postUser(newUser: CreateUserDto): Promise<UserEntity> {
        console.log(newUser);
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

    /*
    ** Update user entity in database's parameters only related to
    ** game stats { ranking, category } 
    **
    ** This service must not be publicly accessible by route endpoint,
    ** only for internal server logic.
    */

    public async updateUserStats(id: number, userInfo: UserGameStats): Promise<UpdateResult> {
        return await this.userRepository.update(id, userInfo);
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

    //public async uploadAvatar(): Promise<UpdateResult> {
//
    //}
//
    //public async removeAvatar(): Promise<UpdateResult> {
    //    /* remove file from filesystem */
    //}

    public async deleteUser(id: number): Promise<void> {
        await this.userRepository.softDelete(id);
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
