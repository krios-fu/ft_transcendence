import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAchievementDto } from './dto/achievement.dto';
import { AchievementEntity } from './entity/achievement.entity';
import { AchievementsRepository } from './repository/achievements.repository';

@Injectable()
export class AchievementsService {
    constructor(
        @InjectRepository(AchievementEntity)
        private readonly achievementsRepository: AchievementsRepository,
    ) { }

    public async getAllAchievements(): Promise<AchievementEntity[]> {
        return await this.achievementsRepository.find();
    }

    public async getOneAchievement(id: number): Promise<AchievementEntity> {
        return await this.achievementsRepository.findOne({ where: { id: id } });
    }

    public async createAchievement(dto: CreateAchievementDto): Promise<AchievementEntity> {
        return await this.achievementsRepository.save(new AchievementEntity(dto));
    }

    public async deleteAchievement(id: number): Promise<void> {
        await this.achievementsRepository.softDelete(id);
    }
}
