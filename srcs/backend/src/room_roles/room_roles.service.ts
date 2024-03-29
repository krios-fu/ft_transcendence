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

    public async findAndCountAll(queryParams?: RoomRolesQueryDto)
                                        : Promise<[RoomRolesEntity[], number]> {
        if (queryParams !== undefined)
        {
            return await this.roomRolesRepository.findAndCount(
                new QueryMapper(queryParams)
            );
        }
        return await this.roomRolesRepository.findAndCount();
    }

    public async findOne(id: number): Promise<RoomRolesEntity> {
        return await this.roomRolesRepository.findOne({
            where: { id: id }
        });
    }

    public async findByRoomId(id: number): Promise<RoomRolesEntity[]> {
        return await this.roomRolesRepository.createQueryBuilder('room_roles')
            .leftJoinAndSelect('room_roles.role', 'role')
            .leftJoinAndSelect('room_roles.room', 'room')
            .where('room_roles.roomId = :room_id', {room_id: id})
            .getMany();
    }

    public async findByRoleId(id: number): Promise<RoomRolesEntity[]> {
        return await this.roomRolesRepository.createQueryBuilder('room_roles')
            .leftJoinAndSelect('room_roles.role', 'role')
            .leftJoinAndSelect('room_roles.room', 'room')
            .where('room_roles.rolesId = :role_id', {role_id: id})
            .getMany();
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
            .where('room_roles.room_id = :room_id', { 'room_id': roomId })
            .andWhere('roles.role = :private_role', { 'private_role': "private" })
            .getOne();
    }

    public async create(dto: CreateRoomRolesDto): Promise<RoomRolesEntity> {
        return await this.roomRolesRepository.save(new RoomRolesEntity(dto));
    }

    public async updatePassword(role: RoomRolesEntity, savedPwd: string, dto: UpdatePasswordDto): Promise<RoomRolesEntity> {
        const { oldPassword: oldPwd, newPassword: newPwd } = dto;

        if (await bcrypt.compare(oldPwd, savedPwd) === false) {
            return null;
        }
        role.password = newPwd;
        await this.roomRolesRepository.save(role);
        return await this.findOne(role.id);
    }

    public async validatePassword(toValidate: string, roomId: number): Promise<boolean> {
        const privateRole: RoomRolesEntity[] = (await this.findByRoomId(roomId))
            .filter(role => role.role.role === 'private');
        if (privateRole.length === 0) {
            return false;
        }
        const { password } = privateRole[0];
        if (password === undefined || password === null) {
            return false;
        }
        return await bcrypt.compare(toValidate, password);
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
        if (role === 'official') {
            return this.userRolesService.validateGlobalRole(username, ['super-admin']);
        } else if (role === 'private') {
            return (await this.userRolesService.validateGlobalRole(username, ['owner', 'admin', 'super-admin'])) ||
                (await this.roomService.findOne(roomId)).owner.username === username;
        }
        return true;
    }

    private inverseRoomRole = (role: string) => (role === 'official') ? 'private' : 'official';

    public async checkRolesConstraints(roomId: number, role: string): Promise<Object | null> {
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
