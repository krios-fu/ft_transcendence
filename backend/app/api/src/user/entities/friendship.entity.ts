import {
	Entity,
	ManyToOne,
  Column,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
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
@Index(['senderId', 'receiverId'], { unique: true })
export class  FriendshipEntity extends BaseEntity {
  constructor(dto?: /*Create*/FriendDto) {
    super();
    if (dto !== undefined) {

    }
  }
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'sender_id' })
  senderId: number

  @ManyToOne(() => UserEntity)
  @JoinColumn(
    {
      name : 'senderId',
    }
  )
  sender : UserEntity

  @Column({ name: 'receiver_id' })
  receiverId: number

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
