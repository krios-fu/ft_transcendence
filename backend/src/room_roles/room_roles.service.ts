import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from 'src/common/mappers/query.mapper';
import { RolesEntity } from 'src/roles/entity/roles.entity';
import { RoomService } from 'src/room/room.service';
import { UserRolesService } from 'src/user_roles/user_roles.service';
import { CreateRoomRolesDto, UpdatePasswordDto } from './dto/room_roles.dto';
import { RoomRolesQueryDto } from './dto/room_roles.query.dto';
import { RoomRolesEntity } from './entity/room_roles.entity';
import { RoomRolesRepository } from './repository/room_roles.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RoomRolesService {
    constructor(
        @InjectRepository(RoomRolesEntity)
        private readonly roomRolesRepository: RoomRolesRepository,
        private readonly userRolesService: UserRolesService,
        private readonly roomService: RoomService
    ) { }

    public async findAll(queryParams: RoomRolesQueryDto): Promise<RoomRolesEntity[]> {
        if (queryParams !== undefined) {
            return await this.roomRolesRepository.find(new QueryMapper(queryParams));
        }
        return await this.roomRolesRepository.find();
    }

    public async findOne(id: number): Promise<RoomRolesEntity> {
        return await this.roomRolesRepository.findOne({
            where: { id: id }
        });
    }

    public async findRolesRoom(roomId: number): Promise<RolesEntity[]> {
        let roles: RolesEntity[];
        const roomRoles: RoomRolesEntity[] = await this.roomRolesRepository.createQueryBuilder('room_roles')
            .leftJoinAndSelect('room_roles.roles', 'roles')
            .leftJoinAndSelect('room_roles.room', 'room')
            .where('room_roles.room_id = :id', { id: roomId })
            .getMany();
        
        //const roomRoles = await this.roomRolesRepository.find({
        //    relations: { 
        //        room: true,
        //        role: true,
        //    },
        //    where: { 
        //        room: { id: roomId }
        //    }
        //});
        if (!roomRoles.length) {
            return null;
        }
        roomRoles.forEach((roomRole: RoomRolesEntity) => {
            roles.push(roomRole.role);
        })
        return roles;
    }

    public async findPrivateRoleInRoom(roomId: number): Promise<RoomRolesEntity> {
        return await this.roomRolesRepository.createQueryBuilder('room_roles')
            .leftJoinAndSelect('room_roles.roles', 'roles')
            .leftJoinAndSelect('room_roles.room', 'room')
            .where('room_roles.room_id = :id', { id: roomId })
            .andWhere('roles.role = "private"')
            .getOne();
    }

    public async create(dto: CreateRoomRolesDto): Promise<RoomRolesEntity> {
        const newRoomRole = new RoomRolesEntity(dto);
        return await this.roomRolesRepository.save(newRoomRole);
    }

    public async updatePassword(id: number, savedPwd: string, dto: UpdatePasswordDto): Promise<RoomRolesEntity> {
        const { oldPassword: oldPwd, newPassword: newPwd } = dto;
        if (await bcrypt.compare(savedPwd, oldPwd) === false) {
            return null;
        }
        await this.roomRolesRepository.update(id, { password: newPwd });
        return await this.findOne(id);
    }

    public async delete(id: number): Promise<void> {
        await this.roomRolesRepository.delete(id);
    }

    /* ~~ role identifying service ~~ */

    public async isRole(roleToCheck: string, roomId: number): Promise<boolean> {
        return ((await this.findRolesRoom(roomId))
            .filter(role => role.role === roleToCheck)).length > 0;
    }

    public async validateRoomRole(role: string, username: string, roomId: number): Promise<boolean> {
        if (role === 'official') {
            return this.userRolesService.validateGlobalRole(username, ['admin']);
        } else if (role === 'private') {
            return this.userRolesService.validateGlobalRole(username, ['admin']) ||
                (await this.roomService.findOne(roomId))
                    .owner.username === 'username';
        }
        return true;
    }
}
