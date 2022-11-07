import { Exclude } from "class-transformer";
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity({
	name: 'user'
})
export class UserEntity {

	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ 
		unique: true 
	})
	username : string;
	
	@Column() firstName : string;
	@Column() lastName : string;
	@Column() email : string;
	@Column() photoUrl : string;
  	@Column() profileUrl : string;

	@Column({
		unique: true
	})
	nickName : string;

	@Exclude()
	@Column({
		default: false
	})
	doubleAuth : boolean;

	@CreateDateColumn()
	creationDate : Date;

	@UpdateDateColumn()
	lastConnection : Date;
}
