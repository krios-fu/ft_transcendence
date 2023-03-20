import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlockDto } from '../../user/dto/friendship.dto';
import { FriendshipEntity } from '../../user/entities/friendship.entity';
import { UpdateResult } from 'typeorm';
import { BlockRepository } from "../repositories/block.repository";
import { BlockEntity } from "../entities/block.entity";
import { FriendshipService } from "./friendship.service";

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

    public async blockFriend(dto: CreateBlockDto): Promise<UpdateResult> {
        const block: BlockEntity = new BlockEntity(dto);

        return await this.friendshipService.blockFriend(dto.friendshipId, block);
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
        const friendship = await this.friendshipService.getOneBlock(senderId, recvId);
        if (friendship === null) {
            return ;
        }
        const test = await this.blockRepository.softDelete(friendship.block.id);
        console.log(`testing: ${JSON.stringify(test)}`); /* remove this laterrrr */
        return await this.friendshipService.unblockFriend(friendship.id);
    }

    

    async getBlockedFriends(userId: number): Promise<FriendshipEntity[]> {
        return await this.friendshipService.getAllBlocks(userId);
    }
}
