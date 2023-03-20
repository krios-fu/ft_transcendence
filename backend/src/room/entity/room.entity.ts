import { CreateRoomDto } from "../../room/dto/room.dto";
import {  
    Column, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn
} from "typeorm";
import { RoomRolesEntity } from "../../room_roles/entity/room_roles.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { BaseEntity } from "../../common/classes/base.entity";

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
}