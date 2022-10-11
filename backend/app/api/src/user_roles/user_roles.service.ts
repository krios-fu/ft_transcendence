import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRolesDto } from './dto/user_roles.dto';
import { UserRolesEntity } from './entity/user_roles.entity';
import { UserRolesRepository } from './repository/user_roles.repository';

@Injectable()
export class UserRolesService {
    constructor (
        @InjectRepository(UserRolesEntity)
        private readonly UserRolesRepository: UserRolesRepository,
    ) { }
    
    public async getAllUserRoles(): Promise<UserRolesEntity[]> {
        return await this.UserRolesRepository.find();
    }

    public async getUserRole(id: number): Promise<UserRolesEntity> { 
        return await this.UserRolesRepository.findOne({
            where: { id: id },
        });
    }

    /* Returns all roles entities associated with user */
    public async getAllRolesFromUser(userId: string): Promise<UserRolesEntity[]> { 
        return await this.UserRolesRepository.find({
            relations: { user: true },
            where: { userId: userId },
        });
    }
    
    /* from role id, return all users with this id */
    public async getUsersWithRole(roleId: string): Promise<UserRolesEntity[]> { 
        return await this.UserRolesRepository.find({
            relations: { role: true },
            where: { roleId: roleId },
        });
    }

    /* Create a new role entity provided RoleUserDto { userId, roleId } */
    public async assignRoleToUser(dto: CreateUserRolesDto): Promise<UserRolesEntity> {  
        //const { roleId, userId } = dto;
//
        //const roleEntity = await this.rolesService.findOne(roleId);
        //if (roleEntity === null) {
        //    throw new HttpException('Role does not exist in db', HttpStatus.BAD_REQUEST);
        //}
        //const userEntity = await this.userService.findOne(userId);
        //if (userEntity === null) {
        //    throw new HttpException('User does not exist in db', HttpStatus.BAD_REQUEST);
        //}
        const newUserRole = new UserRolesEntity(dto);
        return await this.UserRolesRepository.save(newUserRole);
        /* To test:
            -> if typeorm inserts relations with only id column present
            -> if typeorm can insert entity with bad relations
        */
    }

    /* Remove role entity by id */
    public async deleteRoleFromUser(id: number) { 
        await this.UserRolesRepository.delete(id);
    }
    /* Test if delete removes from non-primary key column */
}
                                                          