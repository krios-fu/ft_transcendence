import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    JoinColumn
} from "typeorm";
import { FriendshipEntity } from "../friendship/friendship.entity";
import { UserEntity } from "../user.entity";

@Entity({
    name: "block"
})
export class    BlockEntity {

    @OneToOne(() => FriendshipEntity, (friendship) => friendship.block)
    @JoinColumn()
    friendship: FriendshipEntity

    @PrimaryColumn()
    blockReceiverId: string

    @ManyToOne(() => UserEntity)
    @JoinColumn({
        name: "blockReceiverId"
    })
    blockReceiver: UserEntity

    @PrimaryColumn()
    blockSenderId: string

    @ManyToOne(() => UserEntity)
    @JoinColumn({
        name: "blockSenderId"
    })
    blockSender: UserEntity

    @CreateDateColumn()
    since: Date

}
