import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { UserRolesModule } from 'src/user_roles/user_roles.module';
import { AchievementControlService } from './achievement.control.service';
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
        AchievementControlService
    ],
    exports: [
        AchievementsService,
        AchievementControlService
    ]
})
export class AchievementsModule { }
