import {
	CreateDateColumn,
	Entity,
	ManyToOne,
  Column,
  JoinColumn,
  PrimaryColumn
} from "typeorm";
import { UserEntity } from "../user.entity";

export enum FriendshipStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
  REFUSED = "refused"
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

}
