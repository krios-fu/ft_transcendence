import {
    Entity,
    PrimaryColumn,
    Column,
} from 'typeorm';

@Entity()
export class UsersEntity {
    @PrimaryColumn()
    username: string;

    @Column({
        //type: varchar,
        //nullable: false,
        //unique: true,
    })
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    profileUrl: string;

    @Column()
    email: string;

    @Column()
    photoUrl: string
}
