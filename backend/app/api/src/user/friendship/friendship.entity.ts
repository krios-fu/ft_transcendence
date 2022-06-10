import {
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	ManyToOne,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { UserEntity } from "../user.entity";

export enum FriendshipStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
}

@Entity({
  name: 'friendship'
})
export class  FriendshipEntity {
  
  @ManyToOne(() => UserEntity, {primary: true})
  @JoinColumn(
    {
      name : 'sender'
    }
  )
  sender : UserEntity

  @ManyToOne(() => UserEntity, {primary: true})
  @JoinColumn(
    {
      name : 'receiver'
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
