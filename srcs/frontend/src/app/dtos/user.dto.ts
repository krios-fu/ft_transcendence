
export class UserDto {
	id : number;
	nickName: string;
	username: string;
	firstName: string;
	lastName: string;
	profileUrl: string;
	email: string;
	photoUrl: string;
	doubleAuth: boolean;
	defaultOffline: boolean;
	ranking: number;
	role: {
		is_super_admin: boolean,
		is_admin: boolean,
		is_owner_room : boolean,
		is_banned: boolean,
		is_silenced: boolean,
		is_moderator: boolean,
		is_player: boolean
	};
	achievementUser ?: []
	is_blocked ?: boolean;
	room_id ?: number;


	
  
	constructor(
		id: number,
		nickName: string,
		username:string,
		firstName:string,
		lastName:string,
		profileUrl:string,
		email:string,
		photoUrl:string,
		doubleAuth: boolean,
		defaultOffline: boolean,
		ranking: number,
		role = {
			is_super_admin: false,
			is_admin: false,
			is_owner_room : false,
			is_banned: false,
			is_silenced: false,
			is_moderator: false,
			is_player: false,
		},


		achievementUser ?: [],
		is_blocked ?: boolean,
		room_id ?: number,

	) {
		this.id = id;
		this.nickName = nickName;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.profileUrl = profileUrl;
		this.email = email;
		this.photoUrl = photoUrl;
		this.doubleAuth = doubleAuth;
		this.defaultOffline = defaultOffline;
		this.ranking = ranking;
		this.achievementUser = achievementUser;
		this.role = role;
		this.is_blocked = is_blocked;
		this.room_id = room_id;

	}
  }
  
  export type Payload = {
  
	userProfile: UserDto;
  };