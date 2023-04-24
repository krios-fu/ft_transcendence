import {
    Injectable,
    HttpException,
    HttpStatus,
    NotFoundException,
    BadRequestException
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { FriendshipRepository } from '../../user/repositories/friendship.repository';
import { FriendshipEntity } from '../../user/entities/friendship.entity';
import { FriendshipStatus } from "../enum/friendship-status.enum";
import { CreateFriendDto } from '../../user/dto/friendship.dto';
import { UpdateResult, DataSource } from 'typeorm';
import { BlockEntity } from "../entities/block.entity";
import { NotFoundError } from "rxjs";

@Injectable()
export class FriendshipService {
    constructor(
        @InjectRepository(FriendshipEntity)
        private readonly friendRepository: FriendshipRepository,
        private readonly datasource: DataSource,
    ) { }

    /*
    **  Checks that the two users exist, and starts a transaction
    **  that looks for inverse sender && receiver, and if not found,
    **  then saves the new friendship.
    **
    **  This operation needs to be done in a transaction to
    **  prevent adding the same friendship in inverse order.
    **  As transactions block access to the target resource
    **  until the end of the operation, there is no risk for
    **  two concurrent operations to insert two inverse friendships
    **  at the same time.
    */

    public async addFriend(dto: CreateFriendDto)
        : Promise<FriendshipEntity> {
        const { senderId, receiverId } = dto;
        const friendship = new FriendshipEntity();
        const queryRunner = this.datasource.createQueryRunner();
        let users: UserEntity[];
        let transactionError: any;

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            users = await queryRunner.manager.find(UserEntity, {
                where: [
                    { id: senderId },
                    { id: receiverId }
                ]
            });
            if (users.length != 2)
                throw new NotFoundException("Friend user not found");
            friendship.sender = users[0].id === senderId
                ? users[0] : users[1];
            friendship.receiver = users[0].id === receiverId
                ? users[0] : users[1];
            friendship.senderId = friendship.sender.id;
            friendship.receiverId = friendship.receiver.id;
            if ((await queryRunner.manager.find(FriendshipEntity, {
                where: [
                    {
                        senderId: receiverId,
                        receiverId: senderId
                    },
                    {
                        senderId: senderId,
                        receiverId: receiverId
                    }
                ]
            })).length != 0)
                throw new BadRequestException("Friendship exists already");
            await queryRunner.manager.insert(FriendshipEntity, friendship);
            await queryRunner.commitTransaction();
        } catch (err) {
            console.error(err);
            transactionError = err;
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
        if (transactionError)
            throw transactionError;
        return friendship;
    }

    public async getFriends(userId: number): Promise<FriendshipEntity[]> {
        return (await this.friendRepository.createQueryBuilder("friendship")
            .leftJoinAndSelect(
                "friendship.sender",
                "sender",
                "sender.id!= :id",
                { id: userId })
            .leftJoinAndSelect(
                "friendship.receiver",
                "receiver",
                "receiver.id!= :id",
                { id: userId })
            .where(
                "friendship.senderId= :id"
                + " AND friendship.status= :status",
                {
                    id: userId,
                    status: FriendshipStatus.CONFIRMED
                })
            .orWhere(
                "friendship.receiverId= :id"
                + " AND friendship.status= :status",
                {
                    id: userId,
                    status: FriendshipStatus.CONFIRMED
                })
            .getMany()
        );
    }


    public async getPossibleFriends(userId: number): Promise<FriendshipEntity[]> {
        return await this.friendRepository.createQueryBuilder('friendship')
            .leftJoinAndSelect(
                "friendship.sender",
                "sender",
                "sender.id!= :id",
                { id: userId })
            .leftJoinAndSelect(
                "friendship.receiver",
                "receiver",
                "receiver.id!= :id",
                { id: userId })
            .where(
                "friendship.senderId= :id"
                + " AND friendship.status= :status",
                {
                    id: userId,
                    status: FriendshipStatus.PENDING
                })
            .orWhere(
                "friendship.receiverId= :id"
                + " AND friendship.status= :status",
                {
                    id: userId,
                    status: FriendshipStatus.PENDING
                })
            .getMany()
    }


    public async getOneFriend(userId: number, friendId: number)
        : Promise<FriendshipEntity> {
        return (await this.friendRepository.createQueryBuilder("friendship")
            .leftJoinAndSelect(
                "friendship.sender",
                "sender",
                "sender.id!= :id",
                { id: userId })
            .leftJoinAndSelect(
                "friendship.receiver",
                "receiver",
                "receiver.id!= :id",
                { id: userId })
            .where(
                "friendship.senderId= :uId"
                + " AND friendship.receiverId= :fId"
                + " AND friendship.status= :status",
                {
                    uId: userId,
                    fId: friendId,
                    status: FriendshipStatus.CONFIRMED
                })
            .orWhere(
                "friendship.receiverId= :uId"
                + " AND friendship.senderId= :fId"
                + " AND friendship.status= :status",
                {
                    uId: userId,
                    fId: friendId,
                    status: FriendshipStatus.CONFIRMED
                })
            .getOne()
        );
    }

    public async getAllBlocks(id: number): Promise<FriendshipEntity[]> {
        return await this.friendRepository.createQueryBuilder('friendship')
            .leftJoinAndSelect(
                'friendship.block', 'block',
                'block.sender = :id', { id: id }
            )
            .where(
                'friendship.senderId = :id'
                + ' AND friendship.status = :status',
                {
                    id: id,
                    status: FriendshipStatus.BLOCKED
                }
            )
            .orWhere(
                'friendship.receiverId = :id'
                + ' AND friendship.status = "status',
                {
                    id: id,
                    status: FriendshipStatus.BLOCKED
                }
            ).getMany();
    }

    /*
    ** Get a blocked friendship relation between two users.
    ** Receives as parameters the id of the block sender, and the id of 
    ** the block receiver, and tries to find the correspondent friendship entity.
    **
    ** Block sender in BlockEntity must be setted to senderId.
    */

    public async getOneBlock(
        userId: number,
        blockedId: number,
    ): Promise<FriendshipEntity> {
        return await this.friendRepository.createQueryBuilder('friendship')
            .leftJoinAndSelect(
                'friendship.block',
                'block',
                'block.sender = :user_id', { user_id: userId }
            )
            .where(
                'friendship.senderId = :user_id '
                + ' AND friendship.receiverId = :blocked_id'
                + ' AND friendship.status = :status'
                + ' AND friendship.block.',
                {
                    user_id: userId,
                    blocked_id: blockedId,
                    status: FriendshipStatus.BLOCKED

                })
            .orWhere(
                'friendship.receiverId = :user_id'
                + ' AND friendship.senderId = :blocked_id'
                + ' AND friendship.status = "status',
                {
                    user_id: userId,
                    blocked_id: blockedId,
                    status: FriendshipStatus.BLOCKED
                })
            .getOne();
    }

    /*
    **  Update the status from PENDING to CONFIRMED of a friendship
    **  where sender and receiver usernames match senderId and receiverId.
    */

    public async acceptFriend(receiverId: number, senderId: number)
        : Promise<UpdateResult> {
        return await this.friendRepository.update(
            {
                senderId: senderId,
                receiverId: receiverId,
                status: FriendshipStatus.PENDING
            },
            { status: FriendshipStatus.CONFIRMED }
        );
    }

    public async deletedFriend(id_deleted){
        return await this.friendRepository.delete(
            {
                id : id_deleted
            }
        );
    }

    /*
    **  Update the status from PENDING to REFUSED of a friendship
    **  where sender and receiver usernames match senderId and receiverId.
    */

    public async refuseFriend(receiverId: number, senderId: number)
        : Promise<UpdateResult> {
        return await this.friendRepository.update(
            {
                senderId: senderId,
                receiverId: receiverId,
                status: FriendshipStatus.PENDING
            },
            { status: FriendshipStatus.REFUSED }
        );
    }

    /*
    ** Update the status to BLOCKED of a friendship,
    ** needs id from previous created friendship.
    */

    public async blockFriend(id: number, block: BlockEntity): Promise<UpdateResult> {
        return await this.friendRepository.update(
            id,
            {
                status: FriendshipStatus.BLOCKED,
                block: block
            }
        )
    }

    public async unblockFriend(id: number): Promise<UpdateResult> {
        return await this.friendRepository.update(
            id,
            { status: FriendshipStatus.BLOCKED, block: null } /* test and remove if not necessary !! */
        );
    }
}
