import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlockDto } from '../../user/dto/friendship.dto';
import { FriendshipEntity } from '../../user/entities/friendship.entity';
import { UpdateResult } from 'typeorm';
import { BlockRepository } from "../repositories/block.repository";
import { BlockEntity } from "../entities/block.entity";
import { FriendshipService } from "./friendship.service";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class    BlockService {
    constructor(
        private readonly friendshipService: FriendshipService,
        @InjectRepository(BlockEntity)
        private readonly blockRepository: BlockRepository,
    ) { }

    /*
    **  Update the status of a friendship from CONFIRMED to BLOCKED,
    **  and adds a row in BlockEntity table.
    **
    **  TODO: Implement transaction
    */

    public async blockFriend(dto: CreateBlockDto): Promise<BlockEntity> {
        const block = await this.blockRepository.save(new BlockEntity(dto));

        await this.friendshipService.blockFriend(dto.friendshipId, block);
        return block;
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

    public async unblockFriend(senderId: number, recvId: number)
                        : Promise<UpdateResult> {
        const friendship: FriendshipEntity = await this.friendshipService.getOneBlock(senderId, recvId);
        if (friendship === null) {
            return ;
        }
        await this.blockRepository.remove(friendship.block);
        await this.friendshipService.unblockFriend(friendship.id);
    }

    async getBlockedFriends(userId: number): Promise<FriendshipEntity[]> {
        return await this.friendshipService.getAllBlocks(userId);
    }
}
