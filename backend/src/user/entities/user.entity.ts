import { Exclude } from "class-transformer";
import { ChatEntity } from "src/chat/entities/chat.entity";
import { MessageEntity } from "src/chat/entities/message.entity";
import { BaseEntity } from "src/common/classes/base.entity";
import { DEFAULT_AVATAR_PATH } from "src/common/config/upload-avatar.config";
import {
	Column,
	Entity,
	ManyToMany,
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
		type: 'varchar',
		unique: true,
		nullable: false,
		length: 8
	})
	readonly username : string;
	
	@Column({ 
		type: 'varchar',
		nullable: false,
 	})
  	firstName : string;
	
	@Column({ 
		type: 'varchar',
		nullable: false,
 	})
  	lastName : string;
	
	@Column({ 
		type: 'varchar',
		nullable: false,
 	})
  	email : string;
	
	@Column({ 
		type: 'varchar',
		nullable: false,
		default: DEFAULT_AVATAR_PATH
 	})
  	photoUrl : string;
	
  	@Column({ 
		type: 'varchar',
		nullable: false,
 	})
  	profileUrl : string;
	

	@Column({
		type: 'varchar',
		unique: true,
		nullable: false,
		length: 8
	})
	nickName : string;

	@Column({
		type: 'boolean',
		default: false
	})
	doubleAuth : boolean;

	@Exclude()
	@Column({ 
		type: 'varchar', 
		nullable: true, 
		default: null 
	})
	doubleAuthSecret: string;

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
		type: 'bigint',
		default: 1500
	})
	ranking: number;

	@Column({
		default: Category.Pending
	})
	category : Category;

	@OneToMany(() => MessageEntity, (message) => message.author )
	messages : MessageEntity[];

	@ManyToMany(()=> ChatEntity, (chat) => chat.users)
	chats : ChatEntity[];
}
