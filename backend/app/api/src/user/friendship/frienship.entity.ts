import {
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	ManyToOne
} from "typeorm";
import { UserEntity } from "../user.entity";

@Entity()
export class  FriendshipEntity {

  @ManyToOne(() => UserEntity, (user) => user.friendships, {primary: true})
  friendOne : UserEntity

  @ManyToOne(() => UserEntity, (user) => user.friendships, {primary: true})
  friendTwo : UserEntity

  @CreateDateColumn()
  since : Date

}