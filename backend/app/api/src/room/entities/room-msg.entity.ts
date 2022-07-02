import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "./room.entity";

@Entity({ name: 'room-msg' })
export class RoomMsgEntity {
    @PrimaryGeneratedColumn()
    msg_id: number;

    @Column({
        type: "text",
    })
    msg: string;

    @ManyToOne(
        () => UserEntity, 
        {
            cascade: true,
        }
    )
    @JoinColumn({ name: 'user'})
    user: UserEntity;

    @ManyToOne(
        () => RoomEntity,
        {
            cascade: true,
        }
    )
    @JoinColumn({ name: 'room'})
    room: RoomEntity;

    @Column({
        type: Date,
    })
    date: Date;
}
