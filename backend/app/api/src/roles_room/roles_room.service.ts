import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { UserEntity } from 'src/user/user.entity';
import { UsersRoomService } from 'src/users_room/users_room.service';
import { RolesRoomDto } from './dto/roles_room.dto';
import { RolesRoomEntity } from './entity/roles_room.entity';
import { RolesRoomRepository } from './repository/roles_room.repository';
import { RolesRoomMapper } from './roles_room.mapper';

@Injectable()
export class RolesRoomService {
    constructor(
        @InjectRepository(RolesRoomEntity)
        private readonly rolesRoomRepository: RolesRoomRepository,
        private readonly rolesRoomMapper: RolesRoomMapper,
        private readonly usersRoomService: UsersRoomService,
        private readonly rolesService: RolesService,
    ) { }

    async getRole(id: number): Promise<RolesRoomEntity> { 
        return this.rolesRoomRepository.findOne({
            where: { id: id }
        });
    }

    async getRolesFromRoom(room_id: string): Promise<RolesRoomEntity[]> {
        return this.rolesRoomRepository.find({
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
        const rolesInRoom = this.rolesRoomRepository.find({
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

    async postRoleInRoom(newRoleRoom: RolesRoomDto): Promise<RolesRoomEntity> { 
        const { user_room_id, role_id } = newRoleRoom;
        const roleEntity = await this.rolesService.findOne(role_id);
        if (roleEntity === null) {
            throw new HttpException('no role in db', HttpStatus.BAD_REQUEST);
        }
        const userInRoom = await this.usersRoomService.findOne(user_room_id);
        if (userInRoom === null) {
            throw new HttpException('no user in room', HttpStatus.BAD_REQUEST);
        }
        const roleInRoom = this.rolesRoomMapper.toEntity(newRoleRoom);
        return await this.rolesRoomRepository.save(roleInRoom);
    }

    async remove(id: number): Promise<void> {
        await this.rolesRoomRepository.delete(id);
    }
}
