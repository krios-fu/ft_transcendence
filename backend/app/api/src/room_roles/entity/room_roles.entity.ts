import { RolesEntity } from "src/roles/entity/roles.entity";
import { RoomEntity } from "src/room/entity/room.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateRoomRolesDto } from "../dto/room_roles.dto";

@Entity({ name: 'room_role' })
export class RoomRolesEntity {
    constructor(dto: CreateRoomRolesDto) {
        this.room_id = dto.room_id;
        this.role_id = dto.role_id;
    }
    
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "varchar" })
    room_id: string;

    @ManyToOne(
        () => RoomEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn({ name: "room_id" })
    room: RoomEntity;

    @Column({ type: "varchar" })
    role_id: string;

    @ManyToOne(
        () => RolesEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn({ name: "username" })
    role: RolesEntity;
}
