import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { UserEntity } from 'src/user/user.entity';
import { UserRoomService } from 'src/user_room/user_room.service';
import { CreateUserRoomRolesDto } from './dto/user_room_roles.dto';
import { UserRoomRolesEntity } from './entity/user_room_roles.entity';
import { userRoomRolesRepository } from './repository/user_room_roles.repository';

@Injectable()
export class UserRoomRolesService {
    constructor(
        @InjectRepository(UserRoomRolesEntity)
        private readonly userRoomRolesRepository: userRoomRolesRepository,
        private readonly userRoomService: UserRoomService,
        private readonly rolesService: RolesService,
    ) { }

    async getRole(id: number): Promise<UserRoomRolesEntity> { 
        return this.userRoomRolesRepository.findOne({
            where: { id: id }
        });
    }

    async getRolesFromRoom(room_id: string): Promise<UserRoomRolesEntity[]> {
        return this.userRoomRolesRepository.find({
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
        const rolesInRoom = this.userRoomRolesRepository.find({
            relations: {
                user_in_room: true,
                role: true,
            },
            select: { user_room_id: true },
            where: { role: role_id }
        });
        const users = this.userRoomService.getAllUsersInRoom(room_id);
        return users;
    }

    async postRoleInRoom(newDto: CreateUserRoomRolesDto): Promise<UserRoomRolesEntity> { 
        const { user_room_id, role_id } = newDto;
        const roleEntity = await this.rolesService.findOne(role_id);
        if (roleEntity === null) {
            throw new HttpException('no role in db', HttpStatus.BAD_REQUEST);
        }
        const userInRoom = await this.userRoomService.findOne(user_room_id);
        if (userInRoom === null) {
            throw new HttpException('no user in room', HttpStatus.BAD_REQUEST);
        }
        const roleInRoom = new UserRoomRolesEntity(/* no */);
        return await this.userRoomRolesRepository.save(roleInRoom);
    }

    async remove(id: number): Promise<void> {
        await this.userRoomRolesRepository.delete(id);
    }
}
