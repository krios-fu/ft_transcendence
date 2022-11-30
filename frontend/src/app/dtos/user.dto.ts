
export class UserDto {
	username: string;
	firstName: string;
	lastName: string;
	profileUrl: string;
	email: string;
	photoUrl: string;
  
	constructor(
		username:string,
		firstName:string,
		lastName:string,
		profileUrl:string,
		email:string,
		photoUrl:string
	) {
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.profileUrl = profileUrl;
		this.email = email;
		this.photoUrl = photoUrl;
	}
  }
  
  export type Payload = {
  
	userProfile: UserDto;
	// accessToken: string;
  
  };