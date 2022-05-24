import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';

@Injectable()
export class UserMapper {
    toEntity(userDto: UserDto) {
	const userEntity = new UserEntity();
	
	userEntity.firstName = userDto.firstName;
	userEntity.lastName = userDto.lastName;
	return userEntity;
    }
}
