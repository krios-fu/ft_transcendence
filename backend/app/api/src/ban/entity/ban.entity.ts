import { RoomEntity } from "src/room/entity/room.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateBanDto } from "../dto/ban.dto";

@Entity({ name: 'ban' })
@Index(['userId', 'roomId'], { unique: true })
export class BanEntity {
    constructor(dto?: CreateBanDto) {
        if (dto !== undefined){
            Object.assign(this, dto);
        }
        this.createdAt = new Date;    
    }

    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({
        type: 'bigint',
        name: 'user_id',
        update: false
    })
    userId: number;

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
        type: 'number',
        name: 'room_id',
        update: false
    })
    roomId: number;

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
        name: 'created_at',
        update: false
    })
    createdAt: Date;
}
