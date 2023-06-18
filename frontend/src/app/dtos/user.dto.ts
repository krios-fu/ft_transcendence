
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
	is_admin?: boolean; 
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
		is_admin?: boolean,
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
		this.is_admin = is_admin;
		this.ranking = ranking;
		this.achievementUser = achievementUser;
	}
  }
  
  export type Payload = {
  
	userProfile: UserDto;
	// accessToken: string;
  
  };