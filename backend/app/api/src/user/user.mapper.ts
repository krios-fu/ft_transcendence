import { Injectable } from "@nestjs/common";
import { UserDto } from "./user.dto";
import { User } from "./user.entity";


@Injectable()
export class UserMapper {

	ToEntity( userDto : UserDto ) : User {

		const user = new User();
		user.username = userDto.username;
		user.firstName = userDto.firstName;
		user.lastName = userDto.lastName;
		user.email =  userDto.email;
		user.photo = userDto.photo;
		return  user;
	}

	ToDto( user : User) : UserDto {
		return new UserDto(
			user.username,
			user.firstName,
			user.lastName,
			user.email,
			user.photo);
	}
}
