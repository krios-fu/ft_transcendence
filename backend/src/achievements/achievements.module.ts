import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { UserRolesModule } from '../user_roles/user_roles.module';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { AchievementEntity } from './entity/achievement.entity';
import { AchievementsRepository } from './repository/achievements.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([AchievementEntity]),
        UserModule,
        UserRolesModule,
    ],
    controllers: [AchievementsController],
    providers: [
        AchievementsService,
        AchievementsRepository,
    ],
    exports: [AchievementsService]
})
export class AchievementsModule { }
