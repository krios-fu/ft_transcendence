import { CreateRoomDto } from "../dto/room.dto";
import {  
    Column, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn
} from "typeorm";
import { RoomRolesEntity } from "src/room_roles/entity/room_roles.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { BaseEntity } from "src/common/classes/base.entity";

@Entity({ name: "room" })
export class RoomEntity extends BaseEntity {
    constructor(dto?: CreateRoomDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({
        type: 'varchar',
        name: 'room_id',
        unique: true,
        length: 15,
    })
    roomName!: string;

    @Column({ 
        type: 'date' ,
        name: 'created_at'
    })
    createdAt!: Date;

    @Column({ 
        type: 'bigint',
        name: 'owner_id'
    })
    ownerId!: number;

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