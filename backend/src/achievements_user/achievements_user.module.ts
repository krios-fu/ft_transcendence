import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { UserModule } from 'src/user/user.module';
import { AchievementsUserController } from './achievements_user.controller';
import { AchievementsUserService } from './achievements_user.service';
import { AchievementUserEntity } from './entity/achievement_user.entity';
import { AchievementsUserRepository } from './repository/achievements_user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([AchievementUserEntity]),
        AchievementsModule,
        UserModule,
    ],
    providers: [
        AchievementsUserRepository,
        AchievementsUserService,
    ],
    controllers: [AchievementsUserController],
    exports: [AchievementsUserService]
})
export class AchievementsUserModule {}
