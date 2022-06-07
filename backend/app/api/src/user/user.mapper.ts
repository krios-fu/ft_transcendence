import { Injectable } from '@nestjs/common';
import { UsersEntity } from './user.entity';
import { UsersDto } from './user.dto';

@Injectable()
export class UsersMapper {
    toEntity(userDto: UsersDto): UsersEntity {
        const newEntity = new UsersEntity;

        newEntity.username = userDto.username;
        newEntity.firstName = userDto.firstName;
        newEntity.lastName = userDto.lastName;
        newEntity.profileUrl = userDto.profileUrl;
        newEntity.email = userDto.email;
        newEntity.photoUrl = userDto.photoUrl;
        return newEntity;
    }

    toDto(userEntity: UsersEntity): UsersDto {
        const newDto = new UsersDto;

        newDto.username = userEntity.username;
        newDto.firstName = userEntity.firstName;
        newDto.lastName = userEntity.lastName;
        newDto.profileUrl = userEntity.profileUrl;
        newDto.email = userEntity.email;
        newDto.photoUrl = userEntity.photoUrl;
        return newDto;
    }
}
