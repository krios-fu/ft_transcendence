import { UserRepository } from './user.repository';
import { FriendshipRepository } from './friendship/friendship.repository';
import { UserMapper } from './user.mapper';
import { FriendMapper } from './friendship/friendship.mapper';
import { UserEntity } from './user.entity';
import { FriendshipEntity, FriendshipStatus } from './friendship/friendship.entity';
import { UserDto } from './user.dto';
import {
    Injectable,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendDto } from './friendship/friendship.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: UserRepository,
        @InjectRepository(FriendshipEntity)
        private friendRepository: FriendshipRepository,
        private userMapper: UserMapper,
        private friendMapper: FriendMapper
    ) {
        console.log("UsersService inicializado");
    }

    async findAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async findOne(id: string): Promise<UserEntity> {
        const usr = await this.userRepository.findOne(id);
    
        return usr;
    }

    /* post new user */
    async postUser(newUser: UserDto): Promise<UserEntity> {
        const isInDb = this.findOne(newUser.username);

        if (Object.keys(isInDb).length) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        const newEntity = this.userMapper.toEntity(newUser);

        this.userRepository.save(newEntity);
        return newEntity;
    }

    /*
    **  Delete user by name.
    **
    **  Determine which type of repository method is most appropriate,
    **  delete or remove.
    */
    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    /*
    **  Pending prevent inverse sender, receiver insertion.
    **
    **  @ToDo Try creating a transaction that looks for inverse
    **  sender && receiver, and if not found, then saves
    **  the friendship.
    */

    async addFriend(senderId : string,
                    receiverId : string): Promise<FriendshipEntity> {
        const users = await this.userRepository.find({
            where: [
                { username: senderId },
                { username: receiverId }
            ]
        });
        const friendship = new FriendshipEntity();

        if (users.length != 2) { //TEST
            return friendship;
        }
        friendship.sender = users[0].username
            === senderId ? users[0] : users[1];
        friendship.receiver = users[0].username
            === receiverId ? users[0] : users[1];        
        return await this.friendRepository.save(friendship);
    }

    async getFriends(userId: string): Promise<FriendDto[]>
    {
        const friendships = await this.friendRepository.find({
            relations: ['sender', 'receiver'],
            where: [
                {
                    sender: {
                        username: userId
                    },
                    status: FriendshipStatus.CONFIRMED
                },
                {
                    receiver: {
                        username: userId
                    },
                    status: FriendshipStatus.CONFIRMED
                },
            ]
        });
        let friends: FriendDto[] = [];

        for (let i = 0; i < friendships.length; ++i)
        {
            friends.push(this.friendMapper.toFriendDto(userId, friendships[i]));
        }
        return (friends);
    }

    /*
    **  Update the status from PENDING to CONFIRMED of a friendship
    **  where sender and receiver usernames match senderId and receiverId.
    */
    async acceptFriend(receiverId: string, senderId: string):  Promise<UpdateResult> {
        const result = await this.friendRepository.update(
            {
                sender: {
                    username: senderId
                },
                receiver: {
                    username: receiverId
                },
                status : FriendshipStatus.PENDING
            },
            { status: FriendshipStatus.CONFIRMED }
        );
        return result;
    }

}
