import {
	Entity,
	ManyToOne,
  Column,
  JoinColumn,
  PrimaryColumn,
  BaseEntity
} from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { FriendDto } from "./friendship.dto";

export enum FriendshipStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
  REFUSED = "refused"
}

@Entity({
  name: 'friendship'
})
export class  FriendshipEntity extends BaseEntity {
  constructor(dto?: FriendDto) {
    super();
    if (dto !== undefined) {

    }
  }

  @PrimaryColumn({ name: 'sender_id' })
  senderId: string

  @ManyToOne(() => UserEntity)
  @JoinColumn(
    {
      name : 'senderId',
    }
  )
  sender : UserEntity

  @PrimaryColumn({ name: 'receiver_id' })
  receiverId: string

  @ManyToOne(() => UserEntity)
  @JoinColumn(
    {
      name : 'receiverId'
    }
  )
  receiver : UserEntity

  @Column({
    default: FriendshipStatus.PENDING
  })
  status : FriendshipStatus

}
