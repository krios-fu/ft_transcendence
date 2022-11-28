import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';
export declare class UserMapper {
    toEntity(userDto: UserDto): UserEntity;
    toDto(userEntity: UserEntity): UserDto;
}
