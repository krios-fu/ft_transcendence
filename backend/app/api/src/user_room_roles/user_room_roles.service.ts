import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { UserEntity } from 'src/user/user.entity';
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
                userRoom: true,
                role: true,
            },
            select: { userRoomId: true },
            where: { roleId: roleId }
        });
        const users = this.userRoomService.getAllUsersInRoom(roomId); /* ????? */
        return users;
    }

    public async postRoleInRoom(newDto: CreateUserRoomRolesDto): Promise<UserRoomRolesEntity> { 
        const { userRoomId, roleId } = newDto;
        const roleEntity = await this.rolesService.findOne(roleId);
        if (roleEntity === null) {
            throw new HttpException('no role in db', HttpStatus.BAD_REQUEST);
        }
        const userInRoom = await this.userRoomService.findOne(userRoomId);
        if (userInRoom === null) {
            throw new HttpException('no user in room', HttpStatus.BAD_REQUEST);
        }
        const roleInRoom = new UserRoomRolesEntity(newDto);
        return await this.userRoomRolesRepository.save(roleInRoom);
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
