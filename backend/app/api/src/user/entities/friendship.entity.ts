import {
	Entity,
	ManyToOne,
  Column,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { FriendDto } from "src/user/dto/friendship.dto";
import { BaseEntity } from "src/common/classes/base.entity";

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
