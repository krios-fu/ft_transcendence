import {
	Entity,
	ManyToOne,
  Column,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { CreateFriendDto } from "../../user/dto/friendship.dto";
import { BaseEntity } from "../../common/classes/base.entity";
import { BlockEntity } from "./block.entity";
import { FriendshipStatus } from "../enums/user.enum";

//export enum FriendshipStatus {
//	PENDING = "pending",
//	CONFIRMED = "confirmed",
//  REFUSED = "refused",
//  BLOCKED = "blocked"
//}

@Entity({ name: 'friendship' })
@Index(['senderId', 'receiverId'], { unique: true })
export class  FriendshipEntity extends BaseEntity {
  constructor(dto?: CreateFriendDto) {
    super();
    if (dto !== undefined) {
      Object.assign(this, dto);
    }
  }
  
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ 
    name: 'sender_id',
    type: 'bigint',
    nullable: false,
    update: false,
  })
  senderId: number;

  @ManyToOne(
    () => UserEntity,
    {
      cascade: true,
      eager: true,
    }
  )
  @JoinColumn({ name : 'sender_id' })
  sender: UserEntity;

  @Column({ 
    name: 'receiver_id',
    type: 'bigint',
    nullable: false,
    update: false,
  })
  receiverId: number;

  @ManyToOne(
    () => UserEntity,
    {
      cascade: true,
      eager: true,
    }
  )
  @JoinColumn({ name : 'receiver_id' })
  receiver: UserEntity;

  @Column({
    default: FriendshipStatus.PENDING
  })
  status: FriendshipStatus;

  @OneToOne(() => BlockEntity, (block) => block.friendship, {
    cascade: true
  })
  block: BlockEntity
}
