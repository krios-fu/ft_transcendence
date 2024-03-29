import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from 'src/common/mappers/query.mapper';
import { AchievementsUserQueryDto } from './dto/achievements_user.query.dto';
import { CreateAchievementUserDto } from './dto/achievement_user.dto';
import { AchievementUserEntity } from './entity/achievement_user.entity';
import { AchievementsUserRepository } from './repository/achievements_user.repository';
import { QueryRunner } from 'typeorm';

@Injectable()
export class AchievementsUserService {
    constructor(
        @InjectRepository(AchievementUserEntity)
        private readonly achievementsUserRepository: AchievementsUserRepository,
    ) { }

    /*
    ** Service: get all achievement user entities.
    */
    public async getAllAchievementsUser(queryParams: AchievementsUserQueryDto): Promise<AchievementUserEntity[]> {
        return await this.achievementsUserRepository.find(new QueryMapper(queryParams));
    }

    /*
    ** Service: get one achievement user.
    */
    public async getOneAchievementUser(id: number): Promise<AchievementUserEntity> { 
        return await this.achievementsUserRepository.findOne({ where: { id: id } });
    }

    /*
    ** Service: get all achievement users from from user.
    */
    public async getAchievementsUserFromUser(userId: number): Promise<AchievementUserEntity[]> {
        return await this.achievementsUserRepository.find({ where: { userId: userId } });
    }

    /*
    ** Service: create a new achievement for a user.
    */
    public async createAchievementUser(dto: CreateAchievementUserDto,
                                        qR?: QueryRunner)
                                        : Promise<AchievementUserEntity> {
        if (qR)
        { // For transactions
            return (
                await qR.manager.getRepository(AchievementUserEntity).save(dto)
            );
        }
        return await this.achievementsUserRepository.save(dto);
    }

    /*
    ** Service: delete a user achievement.
    */
    public async removeAchievementUser(id: number): Promise<void> {
        await this.achievementsUserRepository.delete(id);
    }
}
