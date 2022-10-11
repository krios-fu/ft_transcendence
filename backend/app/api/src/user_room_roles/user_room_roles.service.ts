import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { UserRoomService } from 'src/user_room/user_room.service';
import { CreateUserRoomRolesDto } from './dto/user_room_roles.dto';
import { UserRoomRolesEntity } from './entity/user_room_roles.entity';
import { UserRoomRolesRepository } from './repository/user_room_roles.repository';

@Injectable()
export class UserRoomRolesService {
    constructor(
        @InjectRepository(UserRoomRolesEntity)
        private readonly userRoomRolesRepository: UserRoomRolesRepository,
        private readonly userRoomService: UserRoomService,
        private readonly userService: UserService,
        private readonly rolesService: RolesService,
    ) { }

    public async getAllRoles(): Promise<UserRoomRolesEntity[]> {
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
                //userRoom: true,
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

    public async postRoleInRoom(dto: CreateUserRoomRolesDto): Promise<UserRoomRolesEntity> { 
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
}
