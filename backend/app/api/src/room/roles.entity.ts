import { UserEntity } from "../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Roles } from "./roles.enum";
import { RoomEntity } from "./room.entity";

@Entity()
export class RolesEntity {
    @ManyToOne(
        () => UserEntity,
        { primary: true }
    )
    user: UserEntity;

    @ManyToOne(
        () => RoomEntity,
        { primary: true }
    )
    room: RoomEntity;

    @Column({
        type: 'enum',
        enum: Roles,
        default: Roles.User,
        nullable: false
    })
    role: Roles;

    @Column({
        type: Date,
        nullable: true
    })
    silencedDate: Date;

    constructor (
        user: UserEntity,
        room: RoomEntity,
        role: Roles = Roles.User,
        date?: Date
    ) {
        this.user = user;
        this.room = room;
        this.role = role,
        this.silencedDate = date;
    }
}