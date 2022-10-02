import { RolesEntity } from "src/roles/entity/roles.entity";
import { RoomEntity } from "src/room/entity/room.entity";
import { UserEntity } from "src/user/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, TreeLevelColumn } from "typeorm";

@Entity({ name: 'room_role'})
export class RoomRolesEntity {
    constructor(
        room: RoomEntity,
        role: RolesEntity,
    ) {
        this.room = room;
        this.role = role;
    }
    
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(
        () => UserEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn({ name: "room_id" })
    room: RoomEntity;

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
