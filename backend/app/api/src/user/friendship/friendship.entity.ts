import {
	CreateDateColumn,
	Entity,
	ManyToOne,
  Column,
  JoinColumn,
  PrimaryColumn,
  OneToOne
} from "typeorm";
import { BlockEntity } from "../block/block.entity";
import { UserEntity } from "../user.entity";

export enum FriendshipStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
  REFUSED = "refused",
  BLOCKED = "blocked"
}

@Entity({
  name: 'friendship'
})
export class  FriendshipEntity {

  @PrimaryColumn()
  senderId: string

  @ManyToOne(() => UserEntity)
  @JoinColumn(
    {
      name : 'senderId',
    }
  )
  sender : UserEntity

  @PrimaryColumn()
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

  @CreateDateColumn()
  since : Date

  @OneToOne(() => BlockEntity, (block) => block.friendship, {
    cascade: true
  })
  block: BlockEntity

}
