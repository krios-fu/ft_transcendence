import { Exclude } from "class-transformer";
import { RefreshTokenEntity } from "src/auth/entity/refresh-token.entity";
import { ChatEntity } from "src/chat/entities/chat.entity";
import { MessageEntity } from "src/chat/entities/message.entity";
import { BaseEntity } from "src/common/classes/base.entity";
import { DEFAULT_AVATAR_PATH } from "src/common/config/upload-avatar.config";
import { RoomEntity } from "src/room/entity/room.entity";
import { UserRoomEntity } from "src/user_room/entity/user_room.entity";
import {
	Column,
	Entity,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { CreateUserDto } from "../dto/user.dto";
import { Category } from "../enum/category.enum";

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

	@OneToMany(
		() => RoomEntity,
		(room: RoomEntity) => room.owner,
		{ onDelete: 'CASCADE' } 
	)

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
		() => UserRoomEntity,
		(userRoom: UserRoomEntity) => userRoom.user,
		{ 
            cascade: true,
            onDelete: 'CASCADE'
        }
	)
	userRoom: UserRoomEntity[];

	@OneToMany(() => MessageEntity, (message) => message.author)
	messages : MessageEntity[];

	@ManyToMany(()=> ChatEntity, (chat) => chat.users)
	chats : ChatEntity[];

	@OneToOne
	(
		() => RefreshTokenEntity,
		(tokenEntity: RefreshTokenEntity) => tokenEntity.authUser,
		{ cascade: true }
	)
	token: RefreshTokenEntity
}
