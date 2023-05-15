import { UserEntity } from "../../user/entities/user.entity";
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
    name: 'winner'
})
export class    WinnerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => UserEntity,
        { onDelete: 'CASCADE' }
    )
    @JoinColumn()
    user: UserEntity;

    @OneToOne(
        () => MatchEntity, 
        (match: MatchEntity) => match.winner,
        { onDelete: 'CASCADE' }
    )
    match: MatchEntity;

    @Column()
    ranking: number; // Before the match

    @Column()
    category: Category; // Before the match

    @Column()
    score: number;
}
