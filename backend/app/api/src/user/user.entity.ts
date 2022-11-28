import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn,
	ManyToMany,
	OneToMany, JoinColumn, JoinTable
} from "typeorm";
import {ChatEntity} from "../chat/entities/chat.entity";
import {MessageEntity} from "../chat/entities/message.entity";
import {MembershipEntity} from "../chat/entities/membership.entity";

export enum Category {
	Pending,
	Iron,
	Bronze,
	Silver,
	Gold,
	Platinum
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
		default: 1500
	})
	ranking: number;

	@Column({
		default: Category.Pending
	})
	category : Category;

	@CreateDateColumn()
	creationDate : Date;

	@UpdateDateColumn()
	lastConnection : Date;


	@OneToMany((type) => MessageEntity, (message) => message.author )
	messages : MessageEntity[];

	@OneToMany(()=>MembershipEntity, (membership) => membership.user, )
	membership : MembershipEntity[];

}
