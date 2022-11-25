
import { Injectable } from "@nestjs/common";
import { FriendDto } from "./dto/friendship.dto";
import { FriendshipEntity, FriendshipStatus } from "./entities/friendship.entity";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class  FriendMapper {

  toFriendDto(userId: number, friendship: FriendshipEntity): FriendDto {
    const friend = new FriendDto();

    friend.user = friendship.sender.id != userId
      ? friendship.sender 
      : friendship.receiver;
    friend.status = friendship.status;
    friend.since = friendship.createdAt;
    return (friend);
  }

  toBlockedFriendDto(userId: number, friendship: FriendshipEntity): FriendDto {
    const friend = new FriendDto();
    friend.user = new UserEntity();

    friend.user = friendship.sender.id != userId
      ? friendship.sender 
      : friendship.receiver;
    /* Blocked status ?? */
    friend.since = new Date(); /* check this */
    return (friend);
  }

}