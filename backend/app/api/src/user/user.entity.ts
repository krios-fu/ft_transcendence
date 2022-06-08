import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn,
	ManyToMany,
	ManyToOne,
	OneToMany, JoinTable
} from "typeorm";
import {ChatEntity} from "../chat/chat.entity";
import {MessageEntity} from "../chat/message.entity";

export enum UserStatus {
	ONLINE = "online",
	OFFLINE = "offline",
	PLAYING = "playing",
}

@Entity()
export class UserEntity {

	@PrimaryColumn()
	username : string;
	
	@Column()
	firstName : string;

	@Column()
	lastName : string;

	@Column()
	email : string;

	@Column()
	photoUrl : string;

	@Column()
	profileUrl : string;

	@Column()
	nickName : string;

	@Column({
		default: false
	})
	doubleAuth : boolean;

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.ONLINE
	})
	status : UserStatus;

	@CreateDateColumn()
	creationDate : Date;

	@UpdateDateColumn()
	lastConnection : Date;

	@ManyToMany((type) => ChatEntity )
	@JoinTable()
	chats : ChatEntity [];

	@OneToMany((type) => MessageEntity, (message) => message.user )
	@JoinTable()
	messages : MessageEntity[];

	//Relations

	/*@ManyToMany(() => Room, (room) => room.users)
  rooms: Room[];

	@OneToMany(() => Score, (score) => score.user)
	scores: Score[];

	@OneToMany(() => Friendship, (friendship) => friendship.user)
	friendships: Friendship[];*/
}
