import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import { FriendshipRepository } from 'src/user/repositories/friendship.repository';
import { FriendshipEntity, FriendshipStatus } from 'src/user/entities/friendship.entity';
import { FriendDto } from 'src/user/dto/friendship.dto';
import { UpdateResult, DataSource } from 'typeorm';
import { FriendMapper } from "../friendship.mapper";

@Injectable()
export class    FriendshipService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: UserRepository,
        @InjectRepository(FriendshipEntity)
        private readonly friendRepository: FriendshipRepository,
        private readonly friendMapper: FriendMapper,
        private readonly datasource: DataSource,
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

    public async addFriend(senderId : string, receiverId : string)
                    : Promise<FriendshipEntity> {
        const   friendship = new FriendshipEntity();
        const   queryRunner = this.datasource.createQueryRunner();
        let     users: UserEntity[];

        //Start transaction
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            users = await this.userRepository.find({
                where: [
                    { username: senderId },
                    { username: receiverId }
                ]
            });
            if (users.length != 2)
                throw new Error("Users not found.");
            friendship.sender = users[0].username === senderId
                ? users[0] : users[1];
            friendship.receiver = users[0].username === receiverId
                ? users[0] : users[1];
            if ( (await this.friendRepository.find({
                where: {
                    senderId: receiverId,
                    receiverId: senderId
                }
            })).length != 0 )
                throw new Error("Inverse friendship found.");
            await this.friendRepository.insert(friendship);
            await queryRunner.commitTransaction();
        } catch (err) {
            console.log(err);
            return new FriendshipEntity();
        } finally {
            await queryRunner.release();
        }
        return friendship;
    }

    async getFriends(userId: string): Promise<FriendshipEntity[]> {
        const friendships = await this.friendRepository.find({
            relations: {
                sender: true,
                receiver: true,
            },
            where: [
                {
                    senderId: userId,
                    status: FriendshipStatus.CONFIRMED,
                },
                {
                    receiverId: userId,
                    status: FriendshipStatus.CONFIRMED,
                },
            ]
        });
        let friends: FriendDto[] = [];

    //    for (let i = 0; i < friendships.length; ++i)
    //   {
    //        friends.push(this.friendMapper.toFriendDto(userId, friendships[i]));
    //    }
        return (friendships);
    }

    async getOneFriend(userId: string, friendId: string): Promise<FriendDto> {
        const friendship = await this.friendRepository.find({
            relations: {
                sender: true,
                receiver: true
            },
            where: [
                {
                    senderId: userId,
                    receiverId: friendId,
                    status: FriendshipStatus.CONFIRMED
                },
                {
                    senderId: friendId,
                    receiverId: userId,
                    status: FriendshipStatus.CONFIRMED
                }
            ]
        });
        if (friendship.length != 1)
            return new FriendDto();
        return this.friendMapper.toFriendDto(userId, friendship[0]);
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

    /*
    **  Update the status from PENDING to REFUSED of a friendship
    **  where sender and receiver usernames match senderId and receiverId.
    */

    async refuseFriend(receiverId: string, senderId: string)
                        :  Promise<UpdateResult> {
        return await this.friendRepository.update(
            {
                senderId: senderId,
                receiverId: receiverId,
                status: FriendshipStatus.PENDING
            },
            { status: FriendshipStatus.REFUSED }
        );
    }

}