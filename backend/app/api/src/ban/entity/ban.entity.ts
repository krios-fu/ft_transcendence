import { RoomEntity } from "src/room/entities/room.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ban' })
@Index(['user_id', 'room_id'], { unique: true })
export class BanEntity {
    constructor(
        user_id: string,
        room_id: string,
    ) {
        this.user_id = user_id;
        this.room_id = room_id;
        this.created = new Date;    
    }

    @PrimaryGeneratedColumn('increment', { type: 'bigint'} )
    id: number;

    @Column({
        type: 'varchar',
        update: false,
    })
    user_id: string;

    @ManyToOne(
        () => UserEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({
        type: 'varchar',
        update: false,
    })
    room_id: string;

    @ManyToOne(
        () => UserEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn({ name: 'room_id' })
    room: RoomEntity;

    @Column({
        type: 'date',
        update: false,
    })
    created: Date;
}
