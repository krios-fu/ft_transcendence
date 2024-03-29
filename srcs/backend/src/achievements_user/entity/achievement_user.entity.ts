import { BaseEntity } from "../../common/classes/base.entity";
import { 
    Column, 
    Entity, 
    Index, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn
} from "typeorm";
import { CreateAchievementUserDto } from "../dto/achievement_user.dto";
import { UserEntity } from "../../user/entities/user.entity";
import { AchievementEntity } from "../../achievements/entity/achievement.entity";

@Entity({ name: 'achievement_user' })
@Index(['achievementId', 'userId'], { unique: true })
export class AchievementUserEntity extends BaseEntity {
    constructor(dto?: CreateAchievementUserDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }

    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({ 
        name: 'user_id',
        type: 'bigint'
    })
    userId: number;

    @ManyToOne(
        () => UserEntity,
        { onDelete: 'CASCADE' }
        )
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ 
        name: 'achievement_id',
        type: 'bigint'
    })
    achievementId: number;

    @ManyToOne(
        () => AchievementEntity,
        (achievement: AchievementEntity) => achievement.achievementUser,
        {
            onDelete: 'CASCADE',
            eager: true
        }
    )
    @JoinColumn({ name: 'achievement_id' })
    achievement: AchievementEntity;
}
