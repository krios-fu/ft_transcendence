import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { AchievementEntity } from './entity/achievement.entity';
import { AchievementsRepository } from './repository/achievements.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([AchievementEntity]),
    ],
    controllers: [AchievementsController],
    providers: [
        AchievementsService,
        AchievementsRepository,
    ],
    exports: [AchievementsService]
})
export class AchievementsModule { }
