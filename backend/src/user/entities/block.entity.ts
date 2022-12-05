import {
    Entity,
    ManyToOne,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    Column
} from "typeorm";
import { FriendshipEntity } from "src/user/entities/friendship.entity";
import { UserEntity } from "../entities/user.entity";
import { BaseEntity } from "src/common/classes/base.entity";
import { CreateBlockDto } from "../dto/friendship.dto";

@Entity({ name: "block" })
export class BlockEntity extends BaseEntity {
    constructor(dto?: CreateBlockDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: 'friendship_id' })
    friendshipId: number;

    @OneToOne(() => FriendshipEntity, (friendship) => friendship.block)
    @JoinColumn({ name: 'frinedship_id' })
    friendship: FriendshipEntity

    @Column({ name: 'block_sender_id' })
    blockSenderId: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'blockSender_id' })
    blockSender: UserEntity
}
