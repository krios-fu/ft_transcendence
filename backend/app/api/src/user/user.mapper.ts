import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserMapper {
    toEntity(userDto: CreateUserDto): UserEntity {
        const newEntity = new UserEntity;

        newEntity.username = userDto.username;
        newEntity.firstName = userDto.firstName;
        newEntity.lastName = userDto.lastName;
        newEntity.profileUrl = userDto.profileUrl;
        newEntity.email = userDto.email;
        newEntity.photoUrl = userDto.photoUrl;
        newEntity.nickName = newEntity.username;
        return newEntity;
    }

    toDto(userEntity: UserEntity): UserDto {
        const newDto = new CreateUserDto;

        newDto.username = userEntity.username;
        newDto.firstName = userEntity.firstName;
        newDto.lastName = userEntity.lastName;
        newDto.profileUrl = userEntity.profileUrl;
        newDto.email = userEntity.email;
        newDto.photoUrl = userEntity.photoUrl;
        return newDto;
    }
}
