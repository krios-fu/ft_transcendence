import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn,
	ManyToMany,
	ManyToOne,
	OneToMany
} from "typeorm";

export enum UserStatus {
	ONLINE = "online",
	OFFLINE = "offline",
	PLAYING = "playing",
}

@Entity()
export class User {

	@PrimaryColumn()
	username : string;
	
	@Column()
	firstName : string;

	@Column()
	lastName : string;

	@Column()
	email : string;

	@Column()
	photo : string;

	@Column()
	nickName ?: string;

	@Column()
	doubleAuth ?: boolean;

	@Column({
		type: 'enum',
		enum: UserStatus,
		default: UserStatus.ONLINE
	})
	status ?: UserStatus;

	@CreateDateColumn()
	creationDate ?: Date;

	@UpdateDateColumn()
	lastConnection ?: Date;

	//Relations

	/*@ManyToMany(() => Room, (room) => room.users)
  rooms: Room[];

	@OneToMany(() => Score, (score) => score.user)
	scores: Score[];*/
}
