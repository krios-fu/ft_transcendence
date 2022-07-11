
export interface UserDto {

	username: string;
	firstName: string;
	lastName: string;
	profileUrl: string;
	email: string;
	photoUrl: string;
  
  }
  
  export type Payload = {
  
	userProfile: UserDto;
	accessToken: string;
  
  };