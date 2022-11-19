import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryColumn,
	UpdateDateColumn
} from "typeorm";

export enum Category {
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
		default: 1000
	})
	ranking: number;

	@Column({
		default: Category.Iron
	})
	category : Category;

	@CreateDateColumn()
	creationDate : Date;

	@UpdateDateColumn()
	lastConnection : Date;

}
