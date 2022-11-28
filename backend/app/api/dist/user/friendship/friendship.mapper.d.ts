import { FriendshipEntity } from "./friendship.entity";
import { FriendDto } from "./friendship.dto";
export declare class FriendMapper {
    toFriendDto(userId: string, friendship: FriendshipEntity): FriendDto;
    toBlockedFriendDto(userId: string, friendship: FriendshipEntity): FriendDto;
}
