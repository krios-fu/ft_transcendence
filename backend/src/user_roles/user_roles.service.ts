import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from '../common/mappers/query.mapper';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { CreateUserRolesDto } from './dto/user_roles.dto';
import { UserRolesQueryDto } from './dto/user_roles.query.dto';
import { UserRolesEntity } from './entity/user_roles.entity';
import { UserRolesRepository } from './repository/user_roles.repository';
import { SocketHelper } from 'src/game/game.socket.helper';
import {EventEmitter2} from "@nestjs/event-emitter";
import {DeleteResult} from "typeorm";

@Injectable()
export class UserRolesService {
    constructor (
        @InjectRepository(UserRolesEntity)
        private readonly userRolesRepository: UserRolesRepository,
        private readonly userService: UserService,
        private readonly eventEmitter: EventEmitter2
    ) { }
    
    public async findAllUserRoles(queryParams: UserRolesQueryDto): Promise<UserRolesEntity[]> {
        if (queryParams !== undefined) {
            return await this.userRolesRepository.find(new QueryMapper(queryParams));
        }
        return await this.userRolesRepository.find();
    }

    public async findOne(id: number): Promise<UserRolesEntity> { 
        return await this.userRolesRepository.findOne({
            where: { id: id },
        });
    }

    /* Returns all roles entities associated with user */
    public async getAllRolesFromUser(userId: number): Promise<UserRolesEntity[]> { 
        return await this.userRolesRepository.find({
            relations: { 
                user: true, 
                role: true 
            },
            where: { userId: userId },
        });
    }

    public async getAllRolesFromUsername(username: string): Promise<UserRolesEntity[]> {
        return await (this.userRolesRepository.createQueryBuilder('user_roles'))
            .leftJoinAndSelect('user_roles.user', 'user')
            .leftJoinAndSelect('user_roles.role', 'roles')
            .where('user.username = :username', { 'username': username })
            .getMany();
    }
    
    /* from role id, return all users with this id */
    public async getUsersWithRole(roleId: number): Promise<UserRolesEntity[]> { 
        return await this.userRolesRepository.find({
            relations: { role: true },
            where: { roleId: roleId },
        });
    }

    /* get user role with id :user_id and :room_id */
    public async getUserRoleByIds(userId: number, roleId: number): Promise<UserRolesEntity> {
        return await (this.userRolesRepository.createQueryBuilder('user_roles'))
            .leftJoinAndSelect('user_roles.user', 'user')
            .leftJoinAndSelect('user_roles.role', 'roles')
            .where('user_roles.userId = :user_id', { 'user_id': userId })
            .andWhere('user_roles.roleId = :role_id', { 'role_id': roleId })
            .getOne();
    }

    /* Create a new role entity provided RoleUserDto { userId, roleId } */
    public async assignRoleToUser(dto: CreateUserRolesDto): Promise<UserRolesEntity> {
        const role: UserRolesEntity = await this.userRolesRepository
                                                .save(new UserRolesEntity(dto));

        if (role) {
            this.eventEmitter.emit('update.roles',
                {
                    userId: dto.userId,
                    ctxName: 'global'
                });
        }
        return role;
    }

    /* Remove role entity by id */
    public async deleteRoleFromUser(role: UserRolesEntity): Promise<void> {
        const { id, userId } = role;
        const delRes: DeleteResult = await this.userRolesRepository.delete(id);

        if (delRes) {
            this.eventEmitter.emit('update.roles',
                {
                    userId: userId,
                    ctxName: 'global'
                });
        }
    }

    public async validateGlobalRole(username: string, roles: string[]): Promise<boolean> {
        const user: UserEntity = await this.userService.findOneByUsername(username)
        return (await this.getAllRolesFromUser(user.id))
            .map(userRole => userRole.role.role)
            .some(role => roles.includes(role));
    }
}
