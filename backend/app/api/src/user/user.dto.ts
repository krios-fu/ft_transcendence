export class UserDto {

	username : string;
	firstName : string;
	lastName : string;
	email : string;
	photo : string;

}

export type Payload = {
	userProfile : UserDto;
	accessToken : string;
}
