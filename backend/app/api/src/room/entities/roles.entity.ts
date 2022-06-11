import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Roles } from "../roles.enum";
import { RoomEntity } from "./room.entity";

@Entity({  name: "roles" })
export class RolesEntity {
    @ManyToOne(
        () => UserEntity,
        { 
            primary: true,
            cascade: ["remove"],
        }
    )
    @JoinColumn({ name: "role_user" })
    user: UserEntity;

    @ManyToOne(
        () => RoomEntity,
        { 
            primary: true,
            cascade: ["remove"],
        }
    )
    @JoinColumn({ name: "role_room" })
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
        date: Date = null,
    ) {
        this.user = user;
        this.room = room;
        this.role = role,
        this.silencedDate = date;
    }
}