import { Exclude } from "class-transformer";
import { RefreshTokenEntity } from "src/auth/entity/refresh-token.entity";
import { ChatUserEntity } from "src/chat/entities/chat-user.entity";
import { ChatMessageEntity } from "src/chat/entities/chat-message.entity";
import { BaseEntity } from "src/common/classes/base.entity";
import { DEFAULT_AVATAR_PATH } from "src/common/config/upload-avatar.config";
import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { CreateUserDto } from "../dto/user.dto";
import { Category } from "../enum/category.enum";

@Entity({ name: 'user' })
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
		default: 1500
	})
	ranking: number;

	@Column({
		default: Category.Pending
	})
	category : Category;

	@OneToMany(
		() => ChatUserEntity, 
		(chatUser: ChatUserEntity) => chatUser.user,
		{
			onDelete: 'CASCADE',
			cascade: true
		}
		 )
	chats: ChatUserEntity[];

	@OneToOne
	(
		() => RefreshTokenEntity,
		(tokenEntity: RefreshTokenEntity) => tokenEntity.authUser,
		{ 
			cascade: true,
			onDelete: 'CASCADE'
		}
	)
	token: RefreshTokenEntity
}
