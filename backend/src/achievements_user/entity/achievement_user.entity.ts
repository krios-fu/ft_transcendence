import { BaseEntity } from "src/common/classes/base.entity";
import { 
    Column, 
    Entity, 
    Index, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn
} from "typeorm";
import { CreateAchievementUserDto } from "../dto/achievement_user.dto";
import { UserEntity } from "src/user/entities/user.entity";

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
        type: 'bigint', 
        unique: true 
    })
    userId: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column({ 
        name: 'achievement_id',
        type: 'bigint', 
        unique: true 
    })
    achievementId: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'achievementId' })
    achievement: UserEntity;
}