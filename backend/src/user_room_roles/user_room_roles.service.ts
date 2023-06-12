import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from '../common/mappers/query.mapper';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { UserRoomRolesDto } from './dto/user_room_roles.dto';
import { UserRoomRolesQueryDto } from './dto/user_room_roles.query.dto';
import { UserRoomRolesEntity } from './entity/user_room_roles.entity';
import { UserRoomRolesRepository } from './repository/user_room_roles.repository';

@Injectable()
export class UserRoomRolesService {
    constructor(
        @InjectRepository(UserRoomRolesEntity)
        private readonly userRoomRolesRepository: UserRoomRolesRepository,
        private readonly userService: UserService,
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
        let users: UserEntity[] = [];

        rolesInRoom.forEach(async (role) => {
            const user = await this.userService.findOne(role.userRoom.userId);
            users.push(user);
        });
        return users;
    }

    public async getUserRolesInRoom(
        userId: number,
        roomId: number
    ): Promise<UserRoomRolesEntity[]> {
        return await this.userRoomRolesRepository
            .createQueryBuilder('user_room_roles')
            .leftJoinAndSelect('user_room_roles.userRoom', 'user_room')
            .leftJoinAndSelect('user_room.user', 'user')
            .leftJoinAndSelect('user_room.room', 'room')
            .where('user.id = :username', { 'username': userId })
            .where('room.id = :roomName', { 'roomName': roomId })
            .getMany();
    }

    public async postRoleInRoom(dto: UserRoomRolesDto): Promise<UserRoomRolesEntity> {
        return await this.userRoomRolesRepository.save(
            new UserRoomRolesEntity(dto)
        );
    }

    public async remove(id: number): Promise<void> {
        await this.userRoomRolesRepository.delete(id);
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
}
