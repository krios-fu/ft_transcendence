import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import { FriendshipEntity } from "../friendship/friendship.entity";
import { UserEntity } from "../user.entity";

@Entity({
    name: "block"
})
export class    BlockEntity {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => FriendshipEntity, (friendship) => friendship.block)
    @JoinColumn()
    friendship: FriendshipEntity

    @ManyToOne(() => UserEntity)
    @JoinColumn({
        name: "blockSender"
    })
    blockSender: UserEntity

    @CreateDateColumn()
    since: Date

}
