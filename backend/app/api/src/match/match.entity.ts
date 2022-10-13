import { WinnerEntity } from "src/match/winner/winner.entity";
import { LoserEntity } from "src/match/loser/loser.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({
    name: 'match'
})
export class    MatchEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => WinnerEntity, (winner) => winner.match, {
        cascade: true,
        eager: true
    })
    @JoinColumn()
    winner: WinnerEntity;

    @OneToOne(() => LoserEntity, (loser) => loser.match, {
        cascade: true,
        eager: true
    })
    @JoinColumn()
    loser: LoserEntity;

    @Column()
    official: boolean;

    @CreateDateColumn()
    playedAt: Date;
}
