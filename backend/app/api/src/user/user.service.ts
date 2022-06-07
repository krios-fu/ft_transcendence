import { UsersRepository } from './users.repository';
import { UsersMapper } from './users.mapper';
import { UsersEntity } from './users.entity';
import { UsersDto } from './users.dto';
import {
    Injectable,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomService } from 'src/room/room.service';
import { RoomEntity } from 'src/room/room.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: UsersRepository,
        private roomService: RoomService,
        private usersMapper: UsersMapper,
    ) {
        console.log("UsersService inicializado");
    }

    /* find all */
    async findAllUsers(): Promise<UsersEntity[]> {
        return await this.usersRepository.find();
    }

    async findOne(id: string): Promise<UsersEntity> {
        const usr = await this.usersRepository.findOne(id);

        const loadedPhoto = await this.usersRepository.findOne({
            where: {
                username: id,
            },
            relations: ["rooms"],
        });
        console.log(JSON.stringify(loadedPhoto));
        return usr;
    }

    /* post new user */
    async postUser(newUser: UsersDto): Promise<UsersEntity> {
        const isInDb = this.findOne(newUser.username);

        if (Object.keys(isInDb).length) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        const newEntity = this.usersMapper.toEntity(newUser);

        this.usersRepository.save(newEntity);
        return newEntity;
    }

    /* delete user by name */
    async deleteUser(toRemove: UsersDto): Promise<void> {
        await this.usersRepository.remove(this.usersMapper.toEntity(toRemove));
    }

    async checkUserRole(role: string): Promise<bool> {
        /* Check here if user is authentified */

        await this.usersRepository.find({
            
        })
    }
}
