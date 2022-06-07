import { UsersEntity } from "../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Roles } from "./roles.enum";
import { RoomEntity } from "./room.entity";

@Entity()
export class RolesEntity {
    @ManyToOne(
        () => UsersEntity,
        { primary: true }
    )
    user: UsersEntity;

    @ManyToOne(
        () => RoomEntity,
        { primary: true }
    )
    room: RoomEntity;

    @Column({
        type: 'enum',
        nullable: false
    })
    role: Roles;

    @Column({
        type: Date,
        nullable: true
    })
    silencedDate: Date;
}