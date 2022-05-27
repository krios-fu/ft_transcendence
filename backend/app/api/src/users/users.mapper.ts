import { Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';
import { UsersDto } from './users.dto';

@Injectable()
export class UsersMapper {
    toEntity(userDto: UsersDto): UsersEntity {
        const newEntity = new UsersEntity;

        newEntity.username = userDto.username;
        newEntity.placeholder = userDto.placeholder;
        return newEntity;
    }

    toDto(userEntity: UsersEntity): UsersDto {
        const newDto = new UsersDto;

        newDto.username = userEntity.username;
        newDto.placeholder = userEntity.placeholder;
        return newDto;
    }
}
