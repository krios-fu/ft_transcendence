import { Injectable } from "@nestjs/common";
import { RolesEntity } from "src/roles/entities/roles.entity";
import { RoomEntity } from "src/room/entities/room.entity";
import { Column, Generated, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Injectable()
export class RolesRoomEntity {
    @Column({
        unique: true,
        type: 'bigint',
    })
    @Generated('increment')
    id: number;

    @PrimaryColumn({
        type: 'varchar',
    })
    room_id: string;

    @ManyToOne(
        () => RoomEntity,
        { cascade: true },
    )
    @JoinColumn({ name: 'user' })
    user: RoomEntity;

    @PrimaryColumn({
        type: 'varchar',
    })
    role_id: string;

    @ManyToOne(
        () => RolesEntity,
        { cascade: true },
    )
    @JoinColumn({ name: "role" })
    role: RolesEntity;

    @Column({
        type: Date,
    })
    date: Date;
}