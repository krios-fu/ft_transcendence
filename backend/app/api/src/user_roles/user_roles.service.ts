import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRolesDto } from './dto/user_roles.dto';
import { UserRolesQueryDto } from './dto/user_roles.query.dto';
import { UserRolesEntity } from './entity/user_roles.entity';
import { UserRolesRepository } from './repository/user_roles.repository';

@Injectable()
export class UserRolesService {
    constructor (
        @InjectRepository(UserRolesEntity)
        private readonly UserRolesRepository: UserRolesRepository,
    ) { }
    
    public async findAllUserRoles(queryParams: UserRolesQueryDto): Promise<UserRolesEntity[]> {
        return await this.UserRolesRepository.find();
    }

    public async findOne(id: number): Promise<UserRolesEntity> { 
        return await this.UserRolesRepository.findOne({
            where: { id: id },
        });
    }

    /* Returns all roles entities associated with user */
    public async getAllRolesFromUser(userId: number): Promise<UserRolesEntity[]> { 
        return await this.UserRolesRepository.find({
            relations: { user: true },
            where: { userId: userId },
        });
    }
    
    /* from role id, return all users with this id */
    public async getUsersWithRole(roleId: number): Promise<UserRolesEntity[]> { 
        return await this.UserRolesRepository.find({
            relations: { role: true },
            where: { roleId: roleId },
        });
    }

    /* Create a new role entity provided RoleUserDto { userId, roleId } */
    public async assignRoleToUser(dto: CreateUserRolesDto): Promise<UserRolesEntity> {
        const newUserRole = new UserRolesEntity(dto);
        return await this.UserRolesRepository.save(newUserRole);
    }

    /* Remove role entity by id */
    public async deleteRoleFromUser(id: number) { 
        await this.UserRolesRepository.delete(id);
    }
    /* Test if delete removes from non-primary key column */

    public async findByUserRoleIds(userId: number, roleId: number) {
        return await this.UserRolesRepository.find({
            where: {
                userId: userId,
                roleId: roleId
            }
        });
    }
}
                                                          