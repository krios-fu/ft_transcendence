import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from '../common/mappers/query.mapper';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { UserRoomRolesDto } from './dto/user_room_roles.dto';
import { UserRoomRolesQueryDto } from './dto/user_room_roles.query.dto';
import { UserRoomRolesEntity } from './entity/user_room_roles.entity';
import { UserRoomRolesRepository } from './repository/user_room_roles.repository';
import {EventEmitter2} from "@nestjs/event-emitter";
import {UserRoomRolesModule} from "./user_room_roles.module";
import {DeleteResult} from "typeorm";
import { UserRoomEntity } from 'src/user_room/entity/user_room.entity';

@Injectable()
export class UserRoomRolesService {
    constructor(
        @InjectRepository(UserRoomRolesEntity)
        private readonly userRoomRolesRepository: UserRoomRolesRepository,
        private readonly userService: UserService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    public async findAllRoles(queryParams: UserRoomRolesQueryDto): Promise<UserRoomRolesEntity[]> {
        if (queryParams !== undefined) {
            return await this.userRoomRolesRepository.find(new QueryMapper(queryParams));
        }
        return await this.userRoomRolesRepository.find();
    }

    public async findRole(id: number): Promise<UserRoomRolesEntity> { 
        return await this.userRoomRolesRepository.findOne({
            where: { id: id }
        });
    }

    public async getRolesFromRoom(roomId: number): Promise<UserRoomRolesEntity[]> {
        return this.userRoomRolesRepository.find({
            relations: {
                userRoom: true,
                role: true,
            },
            where: { 
                userRoom: { roomId: roomId } 
            }
        });
    }

    public async getUsersInRoomByRole(roomId: number, roleId: number): Promise<UserEntity[]> {
        const rolesInRoom: UserRoomRolesEntity[] = await this.userRoomRolesRepository.find({
            relations: {
                userRoom: { user: true },
            },
            select: {
                userRoom: { userId: true },
            },
            where: {
                roleId: roleId,
                userRoom: { roomId: roomId }
            },
        });
        let users: UserEntity[] = await Promise.all(rolesInRoom
            .map(async (role: UserRoomRolesEntity) => await this.userService
                .findOne(role.userRoom.userId)))

        return users;
        /*rolesInRoom.forEach(async (role) => {
            const user = await this.userService.findOne(role.userRoom.userId);
            users.push(user);
        });
        return users;*/
    }

    public async getUserRolesInRoom(
        userId: number,
        roomId: number
    ): Promise<UserRoomRolesEntity[]> {
        return await this.userRoomRolesRepository
            .createQueryBuilder('user_room_roles')
            .leftJoinAndSelect('user_room_roles.role', 'role')
            .leftJoinAndSelect('user_room_roles.userRoom', 'user_room')
            .leftJoinAndSelect('user_room.user', 'user')
            .leftJoinAndSelect('user_room.room', 'room')
            .where('user.id = :username', { 'username': userId })
            .where('room.id = :roomName', { 'roomName': roomId })
            .getMany();
    }

    public async postRoleInRoom(dto: UserRoomRolesDto): Promise<UserRoomRolesEntity> {
        const role: UserRoomRolesEntity = await this.userRoomRolesRepository.save(
            new UserRoomRolesEntity(dto)
        );
        const userRoom: UserRoomEntity = (await this.findRole(role.id)).userRoom;

        if (role) {
            const { userId, roomId } = userRoom;
            this.eventEmitter.emit('update.roles',
                {
                    userId: userId,
                    roomId: roomId,
                    ctxName: 'room'
                });
        }
        return role;
    }

    public async remove(role: UserRoomRolesEntity): Promise<void> {
        const { id } = role;
        const { userId, roomId } = role.userRoom;
        const delRes: DeleteResult = await this.userRoomRolesRepository.delete(id);

        if (delRes) {
            this.eventEmitter.emit('updateRoles',
                {
                    userId: userId,
                    roomId: roomId,
                    ctxName: 'room'
            });
        }
    }

    public async findRoleByIds(userRoomId: number, roleId: number): Promise<UserRoomRolesEntity> {
        return await this.userRoomRolesRepository.findOne({
            where: {
                userRoomId: userRoomId,
                roleId: roleId,
            }
        });
    }

    public async findRoleByAllIds(
        userId: number,
        roomId: number,
        roleId: number
    ): Promise<UserRoomRolesEntity> {
        return await this.userRoomRolesRepository.createQueryBuilder('user_room_roles')
            .leftJoinAndSelect('user_room_roles.userRoom', 'user_room')
            .where('user_room.userId = :user_id', { 'user_id': userId })
            .andWhere('user_room.roomId = :room_id', { 'room_id': roomId })
            .andWhere('user_room_roles.roleId = :role_id', { 'role_id': roleId })
            .getOne();
    }

    public async findRoleByUser(
        userId: number,
        roomId: number,
    ): Promise<UserRoomRolesEntity []> {
        return await this.userRoomRolesRepository.createQueryBuilder('user_room_roles')
            .leftJoinAndSelect('user_room_roles.userRoom', 'user_room')
            .where('user_room.userId = :user_id', { 'user_id': userId })
            .andWhere('user_room.roomId = :room_id', { 'room_id': roomId })
            // .andWhere('user_room_roles.roleId = :role_id', { 'role_id': roleId })
            .getMany();
    }
}
