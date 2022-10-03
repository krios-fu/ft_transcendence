import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/roles.service';
import { UserService } from 'src/user/user.service';
import { CreateUserRolesDto } from './dto/user_roles.dto';
import { UserRolesEntity } from './entity/user_roles.entity';
import { UserRolesRepository } from './repository/user_roles.repository';

@Injectable()
export class UserRolesService {
    constructor (
        @InjectRepository(UserRolesEntity)
        private readonly UserRolesRepository: UserRolesRepository,
        private readonly userService: UserService,
        private readonly rolesService: RolesService,
    ) { }
    
    public async getRoleUser(id: number): Promise<UserRolesEntity> { 
        return await this.UserRolesRepository.findOne({
            where: { id: id },
        });
    }

    /* Returns all roles entities associated with user */
    public async getAllRolesFromUser(user_id: string): Promise<UserRolesEntity[]> { 
        return await this.UserRolesRepository.find({
            relations: { user: true },
            where: { user_id: user_id },
        });
    }
    
    /* from role id, return all users with this id */
    public async getUsersWithRole(role_id: string): Promise<UserRolesEntity[]> { 
        return await this.UserRolesRepository.find({
            relations: { role: true },
            where: { role_id: role_id },
        });
    }

    /* Create a new role entity provided RoleUserDto { user_id, role_id } */
    public async assignRoleToUser(dto: CreateUserRolesDto): Promise<UserRolesEntity> {  
        const { role_id, user_id } = dto;

        const roleEntity = await this.rolesService.findOne(role_id);
        if (roleEntity === null) {
            throw new HttpException('Role does not exist in db', HttpStatus.BAD_REQUEST);
        }
        const userEntity = await this.userService.findOne(user_id);
        if (userEntity === null) {
            throw new HttpException('User does not exist in db', HttpStatus.BAD_REQUEST);
        }
        const UserRolesEntity = new UserRolesEntity(/* no */);
        return await this.UserRolesRepository.save(UserRolesEntity);
    }

    /* Remove role entity by id */
    public async deleteRoleFromUser(id: number) { 
        await this.UserRolesRepository.delete(id);
    }
    /* Test if delete removes from non-primary key column */
}
                                                          