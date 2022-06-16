import {
    HttpException,
    HttpStatus,
    Injectable
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipRepository } from '../friendship/friendship.repository';
import {
    FriendshipEntity,
    FriendshipStatus
} from '../friendship/friendship.entity';
import { BlockEntity } from "../block/block.entity";

@Injectable()
export class    BlockService {
    constructor(
        @InjectRepository(FriendshipEntity)
        private friendRepository: FriendshipRepository,
    ) {
        console.log("BlockService inicializado");
    }

    /*
    **  Update the status of a friendship from CONFIRMED to BLOCKED,
    **  and adds a row in BlockEntity table.
    **
    **  TODO: Implement transaction
    */

    async blockFriend(blockSenderId: string, blockReceiverId: string)
                        :  Promise<FriendshipEntity> {
        const   blockEntity = new BlockEntity();
        const   friendship = await this.friendRepository.findOne({
            relations: {
                sender: true,
                receiver: true
            },
            where: [
                {
                    senderId: blockSenderId,
                    receiverId: blockReceiverId,
                    status: FriendshipStatus.CONFIRMED
                },
                {
                    senderId: blockReceiverId,
                    receiverId: blockSenderId,
                    status: FriendshipStatus.CONFIRMED
                }
            ],
        });
        if (!friendship)
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        blockEntity.blockSenderId = blockSenderId;
        blockEntity.blockSender = friendship.senderId === blockSenderId
            ? friendship.sender : friendship.receiver;
        blockEntity.blockReceiverId = blockReceiverId;
        blockEntity.blockReceiver = friendship.receiverId === blockReceiverId
            ? friendship.receiver : friendship.sender;
        friendship.status = FriendshipStatus.BLOCKED;
        friendship.block = blockEntity;
        return await this.friendRepository.save(friendship);
    }

    async getBlockedFriends(userId: string): Promise<FriendshipEntity[]> {
        const blockedFriendships = await this.friendRepository.find({
            relations: {
                block: {
                    blockReceiver: true
                },
            },
            select: {
                since: true,
                block: {
                    blockReceiverId: true,
                    blockReceiver: {
                        username: true,
                        nickName: true,
                        photoUrl: true
                    }
                }
            },
            where: [
                {
                    block: {
                        blockSenderId: userId
                    },
                    status: FriendshipStatus.BLOCKED,
                }
            ],
        });
        return (blockedFriendships);
    }

}
