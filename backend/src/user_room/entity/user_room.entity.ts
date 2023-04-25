import { BaseEntity } from "src/common/classes/base.entity";
import { RoomEntity } from "src/room/entity/room.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn } from "typeorm";
import { UserRoomRolesEntity } from "src/user_room_roles/entity/user_room_roles.entity";
import { CreateUserRoomDto } from "../dto/user_room.dto";

@Entity({ name: 'users_room' })
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
