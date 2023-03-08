import { CreateRoomDto } from "src/room/dto/room.dto";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { RoomRolesEntity } from "src/room_roles/entity/room_roles.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { BaseEntity } from "src/common/classes/base.entity";
import {ChatEntity} from "../../chat/entities/chat.entity";

@Entity({ name: "room" })
export class RoomEntity extends BaseEntity {
    constructor(dto?: CreateRoomDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }
    @PrimaryGeneratedColumn('increment')
    readonly id!: number;

    @Column({
        type: 'varchar',
        name: 'room_id',
        unique: true,
        length: 15,
    })
    roomName!: string;

    @Column({ 
        type: 'bigint',
        name: 'owner_id'
    })
    ownerId!: number;

    @Column({
        type: 'varchar',
        //length: 
        nullable: true,
        unique: true,
        default: null
    })
    photoUrl: string;

    @ManyToOne(
        () => UserEntity, 
        { 
            cascade: true,
            eager: true
        }
    )
    @JoinColumn({ name: "owner_id" })
    owner!: UserEntity;

    @OneToMany(() => RoomRolesEntity, (roomRole) => roomRole.roomId)
    roomRole: RoomRolesEntity[];

    @Column({ type: 'number', name: 'chat_id' })
    chatId: number;
    @OneToOne(
        () => ChatEntity,
        {
            eager: true,
            cascade: true,
            onDelete: "CASCADE"
        })
    @JoinColumn({ name: 'chat_id' })
    chat: ChatEntity;

}