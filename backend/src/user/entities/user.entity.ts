import { Exclude } from "class-transformer";
import { MembershipEntity } from "src/chat/entities/membership.entity";
import { MessageEntity } from "src/chat/entities/message.entity";
import { BaseEntity } from "src/common/classes/base.entity";
import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm";
import { CreateUserDto } from "../dto/user.dto";

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
export class UserEntity extends BaseEntity {
	constructor(dto?: CreateUserDto) {
		super();
		if (dto !== undefined) {
			Object.assign(this, dto);
			this.nickName = dto.username;
		}
	}

	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ 
		unique: true 
	})
	readonly username : string;
	
	@Column() firstName : string;
	@Column() lastName : string;
	@Column() email : string;
	@Column() photoUrl : string;
  	@Column() profileUrl : string;

	@Column({
		type: 'varchar',
		unique: true,
		length: 12
	})
	nickName : string;

	@Exclude()
	@Column({
		type: 'boolean',
		default: false
	})
	doubleAuth : boolean;

	@Column({
		type: 'boolean',
		default: false
	})
	defaultOffline: boolean;

	@Column({ 
		type: 'boolean',
		default: false
	})
	acceptedTerms: boolean;

	@Column({
		default: 1500
	})
	ranking: number;

	@Column({
		default: Category.Pending
	})
	category : Category;

	@OneToMany((type) => MessageEntity, (message) => message.author )
	messages : MessageEntity[];

	@OneToMany(()=>MembershipEntity, (membership) => membership.user, )
	membership : MembershipEntity[];
}
