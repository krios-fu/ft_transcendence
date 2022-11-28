import { FriendshipService } from "./friendship.service";
import { FriendshipEntity } from './friendship.entity';
import { UpdateResult } from 'typeorm';
export declare class FriendshipController {
    private friendshipService;
    constructor(friendshipService: FriendshipService);
    getFriends(req: any): Promise<FriendshipEntity[]>;
    getOneFriend(req: any, id: string): Promise<FriendshipEntity>;
    postFriend(req: any, id: string): Promise<FriendshipEntity>;
    acceptFriend(req: any, id: string): Promise<UpdateResult>;
}
