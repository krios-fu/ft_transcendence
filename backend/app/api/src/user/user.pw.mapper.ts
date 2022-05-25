import { Injectable } from '@nestjs/common';
import { UserPwEntity } from './user.pw.entity';
import { UserPwDto } from './user.pw.dto';

@Injectable()
export class UserPwMapper {
    toEntity(userPwDto: UserPwDto) {
	const userEntity = new UserPwEntity();
	
	userEntity.username = userPwDto.username;
	userEntity.password = userPwDto.password;
	userEntity.extraValue = userPwDto.extraValue;
	return userEntity;
    }
}
