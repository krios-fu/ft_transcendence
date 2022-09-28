import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { UserService } from 'src/user/user.service';
import { RolesUserDto } from './dto/roles_user.dto';
import { RolesUserEntity } from './entity/roles_user.entity';
import { RolesUserRepository } from './repository/roles_user.repository';
import { RolesUserMapper } from './roles_user.mapper';

@Injectable()
export class RolesUserService {
    constructor (
        @InjectRepository(RolesUserEntity)
        private readonly rolesUserRepository: RolesUserRepository,
        private readonly rolesUserMapper: RolesUserMapper,
        private readonly userService: UserService,
        private readonly rolesService: RolesService,
    ) { }
    
    async getRoleUser(id: number): Promise<RolesUserEntity> { 
        return await this.rolesUserRepository.findOne({
            where: { id: id },
        });
    }

    /* Returns all roles entities associated with user */
    async getAllRolesFromUser(user_id: string): Promise<RolesUserEntity[]> { 
        return await this.rolesUserRepository.find({
            relations: { user: true },
            where: { user_id: user_id },
        });
    }
    
    /* from role id, return all users with this id */
    async getUsersWithRole(role_id: string): Promise<RolesUserEntity[]> { 
        return await this.rolesUserRepository.find({
            relations: { role: true },
            where: { role_id: role_id },
        });
    }

    /* Create a new role entity provided RoleUserDto { user_id, role_id } */
    async assignRoleToUser(rolesUserDto: RolesUserDto): Promise<RolesUserEntity> {  
        const { role_id, user_id } = rolesUserDto;

        const roleEntity = await this.rolesService.findOne(role_id);
        if (roleEntity === null) {
            throw new HttpException('Role does not exist in db', HttpStatus.BAD_REQUEST);
        }
        const userEntity = await this.userService.findOne(user_id);
        if (userEntity === null) {
            throw new HttpException('User does not exist in db', HttpStatus.BAD_REQUEST);
        }
        const rolesUserEntity = this.rolesUserMapper.toEntity(roleEntity, userEntity);
        return await this.rolesUserRepository.save(rolesUserEntity);
    }

    /* Remove role entity by id */
    async deleteRoleFromUser(id: number) { 
        await this.rolesUserRepository.delete(id);
    }
    /* Test if delete removes from non-primary key column */
}
                                                          