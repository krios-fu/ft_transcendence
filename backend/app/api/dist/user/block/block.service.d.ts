import { FriendshipRepository } from '../friendship/friendship.repository';
import { FriendDto } from '../friendship/friendship.dto';
import { FriendMapper } from '../friendship/friendship.mapper';
import { FriendshipEntity } from '../friendship/friendship.entity';
import { BlockRepository } from './block.repository';
import { DataSource } from 'typeorm';
export declare class BlockService {
    private friendRepository;
    private friendMapper;
    private blockRepository;
    private datasource;
    constructor(friendRepository: FriendshipRepository, friendMapper: FriendMapper, blockRepository: BlockRepository, datasource: DataSource);
    blockFriend(blockSenderId: string, blockReceiverId: string): Promise<FriendshipEntity>;
    unblockFriend(blockSenderId: string, blockReceiverId: string): Promise<void>;
    getBlockedFriends(userId: string): Promise<FriendDto[]>;
}
