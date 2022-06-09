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

@Entity()
export class  FriendshipEntity {

  @PrimaryGeneratedColumn('uuid')
    id : number;
  
  @ManyToOne(() => UserEntity)
  @JoinColumn(
    {
      name : 'sender'
    }
  )
  sender : UserEntity

  @ManyToOne(() => UserEntity)
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
