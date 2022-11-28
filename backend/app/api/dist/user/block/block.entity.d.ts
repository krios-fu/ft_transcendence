import { FriendshipEntity } from "../friendship/friendship.entity";
import { UserEntity } from "../user.entity";
export declare class BlockEntity {
    id: number;
    friendship: FriendshipEntity;
    blockSender: UserEntity;
    since: Date;
}
