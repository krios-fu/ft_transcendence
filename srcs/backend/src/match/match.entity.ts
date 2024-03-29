import { WinnerEntity } from "../match/winner/winner.entity";
import { LoserEntity } from "../match/loser/loser.entity";
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
        onDelete: 'CASCADE',
        eager: true
    })
    @JoinColumn()
    winner: WinnerEntity;

    @OneToOne(() => LoserEntity, (loser) => loser.match, {
        onDelete: 'CASCADE',
        eager: true
    })
    @JoinColumn()
    loser: LoserEntity;

    @Column()
    official: boolean;

    @CreateDateColumn()
    playedAt: Date;
}
