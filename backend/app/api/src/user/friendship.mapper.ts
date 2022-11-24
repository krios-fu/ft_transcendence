
import { Injectable } from "@nestjs/common";
import { FriendDto } from "./dto/friendship.dto";
import { FriendshipEntity } from "./entities/friendship.entity";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class  FriendMapper {

  toFriendDto(userId: string, friendship: FriendshipEntity): FriendDto {
    const friend = new FriendDto();

    friend.user = friendship.sender.username != userId
      ? friendship.sender : friendship.receiver;
    friend.status = friendship.status;
    friend.since = friendship.createdAt;
    return (friend);
  }

  toBlockedFriendDto(userId: string, friendship: FriendshipEntity): FriendDto {
    const friend = new FriendDto();
    friend.user = new UserEntity();

    friend.user.nickname = friendship.senderId != userId
      ? friendship.sender.nickName : friendship.receiver.nickName;
    return (friend);
  }

}