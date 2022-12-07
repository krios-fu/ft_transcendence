
export class UserDto {
	id : number;
	username: string;
	firstName: string;
	lastName: string;
	profileUrl: string;
	email: string;
	photoUrl: string;
	doubleAuth: boolean;
	acceptedTerms: boolean;
	defaultOffline: boolean;

	
  
	constructor(
		id: number,
		username:string,
		firstName:string,
		lastName:string,
		profileUrl:string,
		email:string,
		photoUrl:string,
		doubleAuth: boolean,
		acceptedTerms: boolean,
		defaultOffline: boolean,
	) {
		this.id = id;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.profileUrl = profileUrl;
		this.email = email;
		this.photoUrl = photoUrl;
		this.acceptedTerms = acceptedTerms;
		this.doubleAuth = doubleAuth;
		this.defaultOffline = defaultOffline;
	}
  }
  
  export type Payload = {
  
	userProfile: UserDto;
	// accessToken: string;
  
  };