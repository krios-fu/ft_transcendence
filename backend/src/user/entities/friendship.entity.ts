import {
	Entity,
	ManyToOne,
  Column,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { CreateFriendDto } from "src/user/dto/friendship.dto";
import { BaseEntity } from "src/common/classes/base.entity";
import { BlockEntity } from "../block/block.entity";

export enum FriendshipStatus {
	PENDING = "pending",
	CONFIRMED = "confirmed",
  REFUSED = "refused",
  BLOCKED = "blocked"
}

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
  @JoinColumn({ name : 'senderId' })
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
  @JoinColumn({ name : 'receiverId' })
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
