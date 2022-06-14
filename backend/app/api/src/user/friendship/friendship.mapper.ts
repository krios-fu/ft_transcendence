import { FriendshipEntity } from "./friendship.entity";
import { FriendDto } from "./friendship.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class  FriendMapper {

  toFriendDto(userId: string, friendship: FriendshipEntity): FriendDto {
    const friend = new FriendDto();

    friend.user = friendship.sender.username != userId
      ? friendship.sender : friendship.receiver;
    friend.status = friendship.status;
    friend.since = friendship.since;
    return (friend);
  }

}
