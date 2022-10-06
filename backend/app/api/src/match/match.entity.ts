import { UserEntity } from "src/user/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({
    name: 'match'
})
export class    MatchEntity {

    @PrimaryGeneratedColumn()
    id: number;

    /*
    **  https://typeorm.io/relations-faq#how-to-use-relation-id-without-joining-relation
    */
    @Column({
        nullable: true
    })
    winnerId: string;

    @ManyToOne(() => UserEntity)
    winner: UserEntity;

    @Column({
        nullable: true
    })
    loserId: string;

    @ManyToOne(() => UserEntity)
    loser: UserEntity;

    @Column()
    winnerScore: number;

    @Column()
    loserScore: number;

    @Column()
    official: boolean;

    @CreateDateColumn()
    playedAt: Date;
}
