import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from 'src/common/mappers/query.mapper';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { CreateUserRolesDto } from './dto/user_roles.dto';
import { UserRolesQueryDto } from './dto/user_roles.query.dto';
import { UserRolesEntity } from './entity/user_roles.entity';
import { UserRolesRepository } from './repository/user_roles.repository';

@Injectable()
export class UserRolesService {
    constructor (
        @InjectRepository(UserRolesEntity)
        private readonly userRolesRepository: UserRolesRepository,
        private readonly userService: UserService,
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
            relations: { user: true },
            where: { userId: userId },
        });
    }
    
    /* from role id, return all users with this id */
    public async getUsersWithRole(roleId: number): Promise<UserRolesEntity[]> { 
        return await this.userRolesRepository.find({
            relations: { role: true },
            where: { roleId: roleId },
        });
    }

    /* Create a new role entity provided RoleUserDto { userId, roleId } */
    public async assignRoleToUser(dto: CreateUserRolesDto): Promise<UserRolesEntity> {
        const newUserRole = new UserRolesEntity(dto);
        return await this.userRolesRepository.save(newUserRole);
    }

    /* Remove role entity by id */
    public async deleteRoleFromUser(id: number) { 
        await this.userRolesRepository.softDelete(id);
    }
    /* Test if delete removes from non-primary key column */

    public async findByUserRoleIds(userId: number, roleId: number) {
        return await this.userRolesRepository.find({
            where: {
                userId: userId,
                roleId: roleId
            }
        });
    }

    /* 
    **  ~~  [ Validation guard services ]  ~~
    **
    **
    */

    public async validateAdminRole(username: string | undefined): Promise<boolean> {
        let validation: boolean = false;

        if (username === undefined) {
            return false;
        }
        this.userService.findOneByUsername(username).then(async (usr: UserEntity) => {
            this.getAllRolesFromUser(usr.id).then(
                (usrRoles: UserRolesEntity[]) => {
                    validation = usrRoles.filter(usrRole => usrRole.role.role == 'admin').length > 0;
                }
            );
        });
        return validation;
    }

}
                                                          