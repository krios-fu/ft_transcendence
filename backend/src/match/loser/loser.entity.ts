import { UserEntity } from "src/user/entities/user.entity";
import { MatchEntity } from "../match.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Category } from "src/user/enum/category.enum";

@Entity({
    name: 'loser'
})
export class    LoserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @OneToOne(() => MatchEntity, (match) => match.loser)
    match: MatchEntity;

    @Column()
    ranking: number; // Before the match

    @Column()
    category: Category; // Before the match

    @Column()
    score: number;
}
