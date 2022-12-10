import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from 'src/common/mappers/query.mapper';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
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
        return this.userRoomRolesRepository.find();
    }

    public async getRole(id: number): Promise<UserRoomRolesEntity> { 
        return this.userRoomRolesRepository.findOne({
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
        const rolesInRoom = this.userRoomRolesRepository.find({
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
        (await rolesInRoom).forEach(async (role) => {
            const user = await this.userService.findOne(role.userRoom.userId);
            users.push(user);
        });
        return users;
    }

    public async postRoleInRoom(dto: UserRoomRolesDto): Promise<UserRoomRolesEntity> {
        return await this.userRoomRolesRepository.save(
            new UserRoomRolesEntity(dto)
        );
    }

    public async remove(id: number): Promise<void> {
        await this.userRoomRolesRepository.softDelete(id);
    }

    public async findRoleByIds(userRoomId: number, roleId: number): Promise<UserRoomRolesEntity> {
        return await this.userRoomRolesRepository.findOne({
            where: {
                userRoomId: userRoomId,
                roleId: roleId,
            }
        });
    }
}