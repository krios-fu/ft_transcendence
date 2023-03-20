import { AchievementUserEntity } from "src/achievements_user/entity/achievement_user.entity";
import { BaseEntity } from "src/common/classes/base.entity";
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany } from "typeorm";
import { CreateAchievementDto } from "../dto/achievement.dto";

@Entity({ name: 'achievements' })
export class AchievementEntity extends BaseEntity {
    constructor(dto?: CreateAchievementDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }
    
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ name: 'achievement_name', type: 'varchar' })
    achievementName: string;

    @Column({ name: 'description', type: 'varchar' })
    description: string;

    @Column({ name: 'photo_url', type: 'varchar' })
    photoUrl: string;

    @OneToMany(
		() => AchievementUserEntity,
		(achvmUsr: AchievementUserEntity) => achvmUsr.user,
		{
			cascade: true,
			onDelete: 'CASCADE',
			eager: true
		}
	)
	achievementUser: AchievementUserEntity[];
}