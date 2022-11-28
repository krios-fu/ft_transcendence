import { UserRepository } from './user.repository';
import { UserMapper } from './user.mapper';
import { UserEntity } from './user.entity';
import { UpdateUser, UserDto } from './user.dto';
import { UpdateResult } from 'typeorm';
export declare class UserService {
    private userRepository;
    private userMapper;
    constructor(userRepository: UserRepository, userMapper: UserMapper);
    findAllUsers(): Promise<UserEntity[]>;
    findOne(id: string): Promise<UserEntity>;
    postUser(newUser: UserDto): Promise<UserEntity>;
    updateUser(id: string, data: UpdateUser): Promise<UpdateResult>;
    deleteUser(id: string): Promise<void>;
}
