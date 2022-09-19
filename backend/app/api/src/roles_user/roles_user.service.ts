import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesUserDto } from './dto/roles_user.dto';
import { RolesUserEntity } from './entity/roles_user.entity';
import { RolesUserRepository } from './repository/roles_user.repository';

@Injectable()
export class RolesUserService {
    constructor (
        @InjectRepository(RolesUserEntity)
        private readonly rolesUserRepository: RolesUserRepository,
        
    ) { }
    
    async getRoleUser(id: string): Promise<RolesUserEntity> { 
        return await this.rolesUserRepository.findOne({
            where: { id: id },
        });
    }

    /* Returns all roles entities associated with user */
    async getAllRolesFromUser(user_id: string): Promise<RolesUserEntity[]> { 
        return await this.rolesUserRepository.find({
            where: { user_id: user_id },
        });
    }
    /* from role id, return all users with this id */
    async getUsersWithRole(role_id: string): Promise<RolesUserEntity[]> { 
        return await this.rolesUserRepository.find({
            where: { role_id: role_id },
        });
    }

    /* Create a new role entity provided RoleUserDto { user_id, role_id } */
    async assignRoleToUser(rolesUserDto: RolesUserDto): Promise<RolesUserEntity> {


        return await ...;
    }

    /* Remove role entity by id */
    async deleteRoleFromUser() { 
        /* remove role_entity by id */
    }
}
                                                          