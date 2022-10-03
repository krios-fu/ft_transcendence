import { RoomEntity } from "src/room/entity/room.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateUserRoomDto } from "../dto/user_room.dto";

@Entity({name: 'users_room'})
@Index(['user_id', 'room_id'], {unique: true})
export class UserRoomEntity {
    constructor (dto: CreateUserRoomDto) {
        this.user_id = dto.user_id;
        this.room_id = dto.room_id;
        this.created = new Date;
    }

    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    id: number;

    @Column({
        type: 'varchar',
        update: false
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
        update: false
    })
    room_id: string;

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
        update: false,
    })
    created: Date
}
