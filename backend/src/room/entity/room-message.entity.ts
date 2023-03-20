import { BaseEntity } from "src/common/classes/base.entity";
import { UserRoomEntity } from "src/user_room/entity/user_room.entity";
import {Column, 
    Entity, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
    JoinColumn } from "typeorm";
import { CreateRoomMessageDto } from "../dto/room.dto";

@Entity({ name: 'room_messages' })
export class RoomMessageEntity extends BaseEntity {
    constructor(dto?: CreateRoomMessageDto) {
		super();
		if (dto !== undefined) {
			Object.assign(this, dto);
		}
	}

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ name: 'content' })
    content : string;

    @Column( {
        name: 'user_room_id',
        type: 'bigint'
    })
    userRoomId: UserRoomEntity;

    @ManyToOne(
        () => UserRoomEntity,
        (userRoom: UserRoomEntity) => userRoom.messages,
        {
            eager: true,
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({ name: 'user_room_id' })
    userRoom: UserRoomEntity;
}