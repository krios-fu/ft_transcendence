
// import { Injectable } from "@nestjs/common";

// @Injectable()
export class UserDto {

	username : string;
	firstName : string;
	lastName : string;
	email : string;
	photo : string;

	constructor( username: string, firstName: string, lastName: string, email: string, photo: string){
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.photo = photo;}
}
