import { BaseEntity } from "src/common/classes/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
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
}
