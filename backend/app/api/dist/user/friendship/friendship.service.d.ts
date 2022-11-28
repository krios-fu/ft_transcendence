import { FriendshipRepository } from './friendship.repository';
import { FriendshipEntity } from './friendship.entity';
import { UpdateResult, DataSource } from 'typeorm';
export declare class FriendshipService {
    private friendRepository;
    private datasource;
    constructor(friendRepository: FriendshipRepository, datasource: DataSource);
    addFriend(senderId: string, receiverId: string): Promise<FriendshipEntity>;
    getFriends(userId: string): Promise<FriendshipEntity[]>;
    getOneFriend(userId: string, friendId: string): Promise<FriendshipEntity>;
    acceptFriend(receiverId: string, senderId: string): Promise<UpdateResult>;
}
