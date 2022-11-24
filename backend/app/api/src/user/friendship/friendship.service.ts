import {
    Injectable,
    HttpException,
    HttpStatus
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { FriendshipRepository } from './friendship.repository';
import { FriendshipEntity, FriendshipStatus } from './friendship.entity';
import { UpdateResult, DataSource } from 'typeorm';

@Injectable()
export class    FriendshipService {
    constructor(
        @InjectRepository(UserEntity)
        @InjectRepository(FriendshipEntity)
        private friendRepository: FriendshipRepository,
        private datasource: DataSource,
    ) {
        console.log("FriendshipService inicializado");
    }

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

    async addFriend(senderId : string, receiverId : string)
                    : Promise<FriendshipEntity> {
        const   friendship = new FriendshipEntity();
        const   queryRunner = this.datasource.createQueryRunner();
        let     users: UserEntity[];

        //Start transaction
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            users = await queryRunner.manager.find(UserEntity, {
                where: [
                    { username: senderId },
                    { username: receiverId }
                ]
            });
            if (users.length != 2)
                throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
            friendship.sender = users[0].username === senderId
                ? users[0] : users[1];
            friendship.receiver = users[0].username === receiverId
                ? users[0] : users[1];
            if ( (await queryRunner.manager.find(FriendshipEntity, {
                where: {
                    senderId: receiverId,
                    receiverId: senderId
                }
            })).length != 0 )
                throw new HttpException("Conflict", HttpStatus.CONFLICT);
            await queryRunner.manager.insert(FriendshipEntity, friendship);
            await queryRunner.commitTransaction();
        } catch (err) {
            console.log(err);
            throw new HttpException("Internal Server Error",
                                    HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            await queryRunner.release();
        }
        return friendship;
    }

    async getFriends(userId: string): Promise<FriendshipEntity[]> {
        return (await this.friendRepository.createQueryBuilder("friendship")
            .leftJoinAndSelect(
                "friendship.sender",
                "sender",
                "sender.username!= :id",
                {id: userId})
            .leftJoinAndSelect(
                "friendship.receiver",
                "receiver",
                "receiver.username!= :id",
                {id: userId})
            .where(
                "friendship.senderId= :id"
                + "AND friendship.status= :status",
                {
                    id: userId,
                    status: FriendshipStatus.CONFIRMED
                })
            .orWhere(
                "friendship.receiverId= :id"
                + "AND friendship.status= :status",
                {
                    id: userId,
                    status: FriendshipStatus.CONFIRMED
                })
            .getMany()
        );
    }

    async getOneFriend(userId: string, friendId: string)
                        : Promise<FriendshipEntity> {
        return (await this.friendRepository.createQueryBuilder("friendship")
            .leftJoinAndSelect(
                "friendship.sender",
                "sender",
                "sender.username!= :id",
                {id: userId})
            .leftJoinAndSelect(
                "friendship.receiver",
                "receiver",
                "receiver.username!= :id",
                {id: userId})
            .where(
                "friendship.senderId= :uId"
                + "AND friendship.receiverId= :fId"
                + "AND friendship.status= :status",
                {
                    uId: userId,
                    fId: friendId,
                    status: FriendshipStatus.CONFIRMED
                })
            .orWhere(
                "friendship.receiverId= :uId"
                + "AND friendship.senderId= :fId"
                + "AND friendship.status= :status",
                {
                    uId: userId,
                    fId: friendId,
                    status: FriendshipStatus.CONFIRMED
                })
            .getOne()
        );
    }

    /*
    **  Update the status from PENDING to CONFIRMED of a friendship
    **  where sender and receiver usernames match senderId and receiverId.
    */

    async acceptFriend(receiverId: string, senderId: string)
                        :  Promise<UpdateResult> {
        return await this.friendRepository.update(
            {
                senderId: senderId,
                receiverId: receiverId,
                status : FriendshipStatus.PENDING
            },
            { status: FriendshipStatus.CONFIRMED }
        );
    }

}
