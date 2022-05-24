import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserDto } from "./user.dto";




@Entity('user')
export class User {

	@PrimaryColumn()
	username : string;
	
	@Column()
	firstName : string;

	@Column()
	lastName : string;

	@Column()
	email : string;

	@Column()
	photo : string;

	// constructor( userDto : UserDto )
	// {
	
	// }
}
