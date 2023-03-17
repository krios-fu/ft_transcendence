import { Injectable } from "@nestjs/common";
import { AchievementControlService } from "src/achievements/achievement.control.service";
import { AchievementsService } from "src/achievements/achievements.service";
import { AchievementEntity } from "src/achievements/entity/achievement.entity";
import { AchievementsUserService } from "src/achievements_user/achievements_user.service";
import { MatchService } from "src/match/match.service";
import { UserEntity } from "src/user/entities/user.entity";

@Injectable()
export class    GameAchievementsService {

    constructor(
        private readonly achievementsService: AchievementsService,
        private readonly achievementsUserService: AchievementsUserService,
        private readonly achievementControlService: AchievementControlService,
        private readonly matchService: MatchService
    ) {}

    private async _addUserAchievement(userId: number,
                                        achievementId: number): Promise<void> {
        await this.achievementsUserService.createAchievementUser({
            userId: userId,
            achievementId: achievementId
        });
    }

    private async _getPendingAchievements(userId: number)
                        : Promise<AchievementEntity[]> {
        const   allAchievements =
                    await this.achievementsService.getAllAchievements();
        const   userAchievements =
                    await this.achievementsUserService
                            .getAchievementsUserFromUser(userId);
        
        return (
            allAchievements.filter((achievement) => {
                return (userAchievements.find(elem => {
                    return (elem.achievement.id === achievement.id)
                }) === undefined)
            })
        );
    }

    async updateAchievements(userEntity: UserEntity): Promise<void> {
        const   pendingAchievements =
                    await this._getPendingAchievements(userEntity.id);
        const   [matches,] = await this.matchService.findUserMatches({
            username: userEntity.username
        });

        pendingAchievements.forEach(async (achievement) => {
            if (
                this.achievementControlService.check(
                    Number(achievement.id),
                    userEntity.username,
                    matches
                )
            )
            {
                await this._addUserAchievement(
                    userEntity.id,
                    achievement.id
                );
            }
        });
    }
}
