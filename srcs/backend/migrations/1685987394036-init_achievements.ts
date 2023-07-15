import { MigrationInterface, QueryRunner } from "typeorm"
import { AchievementEntity } from "../src/achievements/entity/achievement.entity";

type    AchievementName = "rookie" |
                            "hardcore" |
                            "superior" |
                            "giant killer"

export class initAchievements1685987394036 implements MigrationInterface {
    name = 'initAchievements1685987394036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(AchievementEntity).insert([
            {
                achievementName: "rookie" as AchievementName,
                description: "Play your first match",
                photoUrl: "https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/open-sourcerer-default.png"
            },
            {
                achievementName: "hardcore" as AchievementName,
                description: "Win 2 matches in a row",
                photoUrl:"https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/quickdraw-default.png"
            },
            {
                achievementName: "superior" as AchievementName,
                description: "Win 2 lower rank players",
                photoUrl:"https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/starstruck-default.png"
            },
            {
                achievementName: "giant killer" as AchievementName,
                description: "Win 2 higher rank players",
                photoUrl:"https://raw.githubusercontent.com/Schweinepriester/github-profile-achievements/main/images/galaxy-brain-default.png"
            }
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const   achievementNames: AchievementName[] = [
            "rookie",
            "hardcore",
            "superior",
            "giant killer"
        ];

        for (const achievementName of achievementNames)
        {
            await queryRunner.manager.getRepository(AchievementEntity).delete({
                achievementName: achievementName
            });
        }
    }

}
