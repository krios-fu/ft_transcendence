import {
    Entity,
    PrimaryColumn,
    Column,
} from 'typeorm';

@Entity('user')
export class UsersEntity {
    @PrimaryColumn()
    username: string;

    @Column()
    placeholder: string;
    // ... check again when passport-42 is implemented
}
