import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { UserEntity } from 'src/user/user.entity';
import { UsersRoomService } from 'src/user_room/user_room.service';
import { UserRoomRolesDto } from './dto/user_room_roles.dto';
import { UserRoomRolesEntity } from './entity/user_room_roles.entity';
import { UserRoomRolesRepository } from './repository/user_room_roles.repository';
import { UserRoomRolesMapper } from './user_room_roles.mapper';

@Injectable()
export class UserRoomRolesService {
    constructor(
        @InjectRepository(UserRoomRolesEntity)
        private readonly UserRoomRolesRepository: UserRoomRolesRepository,
        private readonly UserRoomRolesMapper: UserRoomRolesMapper,
        private readonly usersRoomService: UsersRoomService,
        private readonly rolesService: RolesService,
    ) { }

    async getRole(id: number): Promise<UserRoomRolesEntity> { 
        return this.UserRoomRolesRepository.findOne({
            where: { id: id }
        });
    }

    async getRolesFromRoom(room_id: string): Promise<UserRoomRolesEntity[]> {
        return this.UserRoomRolesRepository.find({
            relations: {
                user_in_room: true,
                role_id: true,
            },
            where: { 
                user_in_room: { room_id: room_id } 
            }
        });
    }

    async getUsersInRoomByRole(room_id: string, role_id: string): Promise<UserEntity[]> {
        const rolesInRoom = this.UserRoomRolesRepository.find({
            relations: {
                user_in_room: true,
                role: true,
            },
            select: { user_room_id: true },
            where: { role: role_id }
        });
        const users = this.usersRoomService.getAllUsersInRoom(room_id);
        return users;
    }

    async postRoleInRoom(newRoleRoom: UserRoomRolesDto): Promise<UserRoomRolesEntity> { 
        const { user_room_id, role_id } = newRoleRoom;
        const roleEntity = await this.rolesService.findOne(role_id);
        if (roleEntity === null) {
            throw new HttpException('no role in db', HttpStatus.BAD_REQUEST);
        }
        const userInRoom = await this.usersRoomService.findOne(user_room_id);
        if (userInRoom === null) {
            throw new HttpException('no user in room', HttpStatus.BAD_REQUEST);
        }
        const roleInRoom = this.UserRoomRolesMapper.toEntity(newRoleRoom);
        return await this.UserRoomRolesRepository.save(roleInRoom);
    }

    async remove(id: number): Promise<void> {
        await this.UserRoomRolesRepository.delete(id);
    }
}
