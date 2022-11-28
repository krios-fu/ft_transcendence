import { BlockEntity } from "../block/block.entity";
import { UserEntity } from "../user.entity";
export declare enum FriendshipStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    BLOCKED = "blocked"
}
export declare class FriendshipEntity {
    senderId: string;
    sender: UserEntity;
    receiverId: string;
    receiver: UserEntity;
    status: FriendshipStatus;
    since: Date;
    block: BlockEntity;
}
