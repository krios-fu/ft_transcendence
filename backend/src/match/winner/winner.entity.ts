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

@Entity({
    name: 'winner'
})
export class    WinnerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @OneToOne(() => MatchEntity, (match) => match.winner)
    match: MatchEntity;

    @Column()
    score: number;
}
