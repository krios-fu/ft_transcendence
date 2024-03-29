import { BaseEntity } from "../../common/classes/base.entity";
import { RoomEntity } from "../../room/entity/room.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn } from "typeorm";
import { UserRoomRolesEntity } from "../../user_room_roles/entity/user_room_roles.entity";
import { UserRoomDto } from "../dto/user_room.dto";

@Entity({ name: 'users_room' })
@Index(['userId', 'roomId'], {unique: true})
export class UserRoomEntity extends BaseEntity {
    constructor (dto: UserRoomDto) {
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
            eager: true,
            onDelete: 'CASCADE'
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
            eager: true,
            onDelete: 'CASCADE'
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

    @OneToMany(
        () => UserRoomRolesEntity,
        (userRoomRole: UserRoomRolesEntity) => userRoomRole.userRoom,
        { cascade: true }
    )
    userRoomRole: UserRoomRolesEntity[];
}
