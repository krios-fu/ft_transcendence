import { BlockService } from "./block.service";
import { FriendshipEntity } from '../friendship/friendship.entity';
import { FriendDto } from "../friendship/friendship.dto";
export declare class BlockController {
    private blockService;
    constructor(blockService: BlockService);
    getBlockedFriends(req: any): Promise<FriendDto[]>;
    blockFriend(req: any, id: string): Promise<FriendshipEntity>;
    unblockFriend(req: any, id: string): Promise<void>;
}
