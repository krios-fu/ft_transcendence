import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn,
	ManyToMany,
	OneToMany
} from "typeorm";

export enum UserStatus {
	ONLINE = "online",
	OFFLINE = "offline",
	PLAYING = "playing",
}

@Entity({
	name: 'user'
})
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

	@Column({
		unique: true
	})
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

	//Relations

	/*@ManyToMany(() => Room, (room) => room.users)
  rooms: Room[];

	@OneToMany(() => Score, (score) => score.user)
	scores: Score[];*/

}
