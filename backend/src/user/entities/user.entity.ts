import { Exclude } from "class-transformer";
import { AchievementUserEntity } from "../../achievements_user/entity/achievement_user.entity";
import { RefreshTokenEntity } from "../../auth/entity/refresh-token.entity";
import { ChatUserEntity } from "../../chat/entities/chat-user.entity";
import { BaseEntity } from "../../common/classes/base.entity";
import { DEFAULT_AVATAR_PATH } from "../../common/config/upload-avatar.config";
import { RoomEntity } from "../../room/entity/room.entity";
import { UserRoomEntity } from "../../user_room/entity/user_room.entity";
import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { CreateUserDto } from "../dto/user.dto";
import { Category } from "../enum/category.enum";
import { BanEntity } from "src/ban/entity/ban.entity";

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
		length: 11
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
		length: 11
	})
	nickName : string;

	@OneToMany(
		() => RoomEntity,
		(room: RoomEntity) => room.owner,
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
		{ cascade: true }
	)
	userRoom: UserRoomEntity[];

	@OneToMany(
		() => ChatUserEntity,
		(chatUser: ChatUserEntity) => chatUser.user,
		{ cascade: true }
	)
	chats: ChatUserEntity[];

	@OneToOne
	(
		() => RefreshTokenEntity,
		(tokenEntity: RefreshTokenEntity) => tokenEntity.authUser,
		{ cascade: true }
	)
	token: RefreshTokenEntity;

	@OneToMany(
		() => AchievementUserEntity,
		(achvmUsr: AchievementUserEntity) => achvmUsr.user,
		{
			cascade: true,
			eager: true
		}
	)
	achievementUser: AchievementUserEntity[];

	@OneToMany(
		() => BanEntity,
		(ban: BanEntity) => ban.user,
		{ cascade: true }
	)
	ban: BanEntity
}
