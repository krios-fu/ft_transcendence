import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from '../common/mappers/query.mapper';
import { RolesEntity } from '../roles/entity/roles.entity';
import { RoomService } from '../room/room.service';
import { UserRolesService } from '../user_roles/user_roles.service';
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

    public async findRolesInRoom(roomId: number): Promise<RolesEntity[]> {
        let roles: RolesEntity[] = [];
        const roomRoles: RoomRolesEntity[] = await this.roomRolesRepository.createQueryBuilder('room_roles')
            .leftJoinAndSelect('room_roles.role', 'roles')
            .leftJoinAndSelect('room_roles.room', 'room')
            .where('room_roles.roomId = :id', { id: roomId })
            .getMany();
        
        if (!roomRoles.length) {
            return [];
        }
        roomRoles.forEach((roomRole: RoomRolesEntity) => {
            roles.push(roomRole.role);
        })
        return roles;
    }

    public async findRoomRoleByIds(roomId: number, roleId: number): Promise<RoomRolesEntity> {
        return await this.roomRolesRepository.createQueryBuilder('room_roles')
            .leftJoinAndSelect('room_roles.role', 'roles')
            .leftJoinAndSelect('room_roles.room', 'room')
            .where('room_roles.roomId = :room_id', { 'room_id': roomId })
            .andWhere('room_roles.roleId = :role_id', { 'role_id': roleId })
            .getOne();
    }

    public async findPrivateRoleInRoom(roomId: number): Promise<RoomRolesEntity> {
        return await this.roomRolesRepository.createQueryBuilder('room_roles')
            .leftJoinAndSelect('room_roles.role', 'roles')
            .leftJoinAndSelect('room_roles.room', 'room')
            .where('room_roles.room_id = :id', { id: roomId })
            .andWhere('roles.role = "private"')
            .getOne();
    }

    public async create(dto: CreateRoomRolesDto): Promise<RoomRolesEntity> {
        return await this.roomRolesRepository.save(new RoomRolesEntity(dto));
    }

    public async updatePassword(id: number, savedPwd: string, dto: UpdatePasswordDto): Promise<RoomRolesEntity> {
        const { oldPassword: oldPwd, newPassword: newPwd } = dto;

        if (await bcrypt.compare(savedPwd, oldPwd) === false) {
            return null;
        }
        await this.roomRolesRepository.update(id, { password: newPwd });
        return await this.findOne(id);
    }

    public async validatePassword(toValidate: string, roomId: number): Promise<boolean> {
        const roomRole: RoomRolesEntity = await this.findOne(roomId);
        const { password } = roomRole;

        if (password === undefined) {
            return false;
        }
        return await bcrypt.compare(password, toValidate);
    }

    public async delete(id: number): Promise<void> {
        await this.roomRolesRepository.delete(id);
    }

    /* ~~ role identifying service ~~ */

    public async isRole(roleToCheck: string, roomId: number): Promise<boolean> {
        return ((await this.findRolesInRoom(roomId))
            .filter(role => role.role === roleToCheck)).length > 0;
    }

    public async validateRoomRole(role: string, username: string, roomId: number): Promise<boolean> {
        console.log('role: ', role)
        if (role === 'official') {
            return this.userRolesService.validateGlobalRole(username, ['owner', 'admin']);
        } else if (role === 'private') {
            const owner_test = await this.roomService.findOne(roomId);
            console.log('[ IN VALIDATE ROOM ROLE ]')
            console.log('   -> username provided: ', username)
            console.log('   -> owner received: ', owner_test.owner)
            console.log('   -> name in owner entity: ', owner_test.owner.username)
            console.log('   -> validation: ', (await this.roomService.findOne(roomId)).owner.username === username)
            const tal =  (await this.userRolesService.validateGlobalRole(username, ['owner', 'admin'])) ||
                (await this.roomService.findOne(roomId)).owner.username === username;
            console.log('   -> WHAT WE ARE GOING TO SEND TO CONTROLLER: ', tal)
            return tal;
        }
        return true;
    }

    private inverseRoomRole = (role: string) => (role === 'official') ? 'private' : 'official';

    public async checkRolesConstraints(roomId: number, role: string): Promise<Object | null> {
        console.log('hola???');
        const rolesInRoom: string[] = (await this.findRolesInRoom(roomId))
            .map((role: RolesEntity) => role.role);
        if (rolesInRoom.indexOf(role) !== -1) {
            return { 
                'error': new BadRequestException('resource already found in database'),
                'logMessage': 'role is already set in room configuration'
            }
        }
        if (['official', 'private'].indexOf(role) !== -1 && rolesInRoom.indexOf(this.inverseRoomRole(role)) !== -1) {
            return {
                'error': new ForbiddenException(''),
                'logMessage': 'room cannot contains these two roles simultaneously: private, official'
            }
        }
        return null;
    }
}
