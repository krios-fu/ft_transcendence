
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
		is_silenced: boolean
	};
	achievementUser ?: []


	
  
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
			is_silenced: false
		},


		achievementUser ?: []

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
	}
  }
  
  export type Payload = {
  
	userProfile: UserDto;
  };