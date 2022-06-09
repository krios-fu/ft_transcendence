import { UserEntity } from "../user.entity";
import { FriendshipStatus } from "./friendship.entity";

export class    FriendDto {

    user: UserEntity;
    status: FriendshipStatus;
    since: Date;

}
