
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
	acceptedTerms: boolean;
	defaultOffline: boolean;
	is_admin?: boolean; 

	
  
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
		acceptedTerms: boolean,
		defaultOffline: boolean,
		is_admin?: boolean

	) {
		this.id = id;
		this.nickName = nickName;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.profileUrl = profileUrl;
		this.email = email;
		this.photoUrl = photoUrl;
		this.acceptedTerms = acceptedTerms;
		this.doubleAuth = doubleAuth;
		this.defaultOffline = defaultOffline;
		this.is_admin = is_admin;
	}
  }
  
  export type Payload = {
  
	userProfile: UserDto;
	// accessToken: string;
  
  };