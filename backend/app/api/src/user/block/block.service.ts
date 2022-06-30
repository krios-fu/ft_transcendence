import {
    HttpException,
    HttpStatus,
    Injectable
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { FriendshipRepository } from '../friendship/friendship.repository';
import { FriendDto } from '../friendship/friendship.dto';
import { FriendMapper } from '../friendship/friendship.mapper';
import {
    FriendshipEntity,
    FriendshipStatus
} from '../friendship/friendship.entity';
import { BlockEntity } from "../block/block.entity";
import { BlockRepository } from './block.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class    BlockService {
    constructor(
        @InjectRepository(FriendshipEntity)
        private friendRepository: FriendshipRepository,
        private friendMapper: FriendMapper,
        @InjectRepository(BlockEntity)
        private blockRepository: BlockRepository,
        private datasource: DataSource,
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
        blockEntity.blockSender = friendship.senderId === blockSenderId
            ? friendship.sender : friendship.receiver;
        friendship.status = FriendshipStatus.BLOCKED;
        friendship.block = blockEntity;
        return await this.friendRepository.save(friendship);
    }

    /*
    **  Searches for a BLOCKED friendship where the blockSenderId
    **  appears as the blockSender in the BlockEntity associated
    **  to the friendship.
    **
    **  Need to include the two operations (update FriendshipEntity
    **  status and remove BlockEntity) in a transaction to perform
    **  both operations or none of them.
    */

    async unblockFriend(blockSenderId: string, blockReceiverId: string)
                        : Promise<void> {
        const   queryRunner = this.datasource.createQueryRunner();
        let     blockFriendship: FriendshipEntity;

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            blockFriendship = await queryRunner.manager
                                    .findOne(FriendshipEntity, {
                relations: {
                    block: true
                },
                where: [
                    {
                        senderId: blockReceiverId,
                        block: {
                            blockSender: {
                                username: blockSenderId
                            }
                        },
                        status: FriendshipStatus.BLOCKED
                    },
                    {
                        receiverId: blockReceiverId,
                        block: {
                            blockSender: {
                                username: blockSenderId
                            }
                        },
                        status: FriendshipStatus.BLOCKED
                    }
                ]
            });
            if (!blockFriendship)
                throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
            blockFriendship.status = FriendshipStatus.CONFIRMED;
            await queryRunner.manager.save(FriendshipEntity, blockFriendship);
            await queryRunner.manager.remove(BlockEntity,
                                                blockFriendship.block);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            console.log(err);
            await queryRunner.rollbackTransaction();
            throw new HttpException("Internal Server Error",
                                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.release();
        }
    }

    async getBlockedFriends(userId: string): Promise<FriendDto[]> {
        const blockedFriendships = await this.friendRepository.find({
            relations: {
                sender: true,
                receiver: true,
            },
            select: {
                senderId: true,
                sender: {
                    nickName: true,
                },
                receiverId: true,
                receiver: {
                    nickName: true,
                },
            },
            where: [
                {
                    block: {
                        blockSender: {
                            username: userId
                        }
                    },
                    status: FriendshipStatus.BLOCKED,
                }
            ],
        });
        let friends: FriendDto[] = [];

        for (let i = 0; i < blockedFriendships.length; ++i)
        {
            friends.push(this.friendMapper.toBlockedFriendDto(userId,
                            blockedFriendships[i]));
        }
        return (friends);
    }

}
