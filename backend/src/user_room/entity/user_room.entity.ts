import { BaseEntity } from "src/common/classes/base.entity";
import { RoomEntity } from "src/room/entity/room.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateUserRoomDto } from "../dto/user_room.dto";

@Entity({name: 'users_room'})
@Index(['userId', 'roomId'], {unique: true})
export class UserRoomEntity extends BaseEntity {
    constructor (dto: CreateUserRoomDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }

    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
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
        type: 'bigint',
        name: 'room_id',
        update: false
    })
    roomId: number;

    @ManyToOne(
        () => RoomEntity,
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
        update: false,
    })
    createdAt: Date
}