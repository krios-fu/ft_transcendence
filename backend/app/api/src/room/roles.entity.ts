/* import { UsersEntity } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Role } from "./role.enum";
import { RoomEntity } from "./room.entity";

@Entity()
export class RolesEntity {
    @ManyToOne(
        () => UsersEntity,
    //    (usersEntity) => usersEntity.role,
        { primary: true }
    )
    user: UsersEntity;

    @ManyToOne(
        () => RoomEntity,
    //    (roomEntity) => roomEntity.role,
        { primary: true }
    )
    room: RoomEntity;

    @Column({
        type: 'enum',
        nullable: false
    })
    role: Role;

    @Column({
        type: Date;
        nullable: true
    })
    silencedDate: Date;
} */
