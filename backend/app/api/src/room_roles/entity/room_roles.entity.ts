import { RolesEntity } from "src/roles/entity/roles.entity";
import { RoomEntity } from "src/room/entity/room.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateRoomRolesDto } from "../dto/room_roles.dto";

@Entity({ name: 'room_role' })
@Index(['roomId', 'roleId'], { unique: true })
export class RoomRolesEntity {
    constructor(dto: CreateRoomRolesDto) {
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
        this.createdAt = new Date;
    }
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ 
        type: 'varchar',
        name: 'room_id'
    })
    roomId: string;

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
        type: 'varchar',
        name: 'role_id'
    })
    roleId: string;

    @ManyToOne(
        () => RolesEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn({ name: 'role_id' })
    role: RolesEntity;

    @Column({
        type: 'date',
        name: 'created_at'
    })
    createdAt: Date;
}
