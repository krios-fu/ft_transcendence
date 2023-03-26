import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from '../common/mappers/query.mapper';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
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
            relations: { 
                user: true, 
                role: true 
            },
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

    /* get user role with id :user_id and :room_id */
    public async getUserRoleByIds(userId: number, roleId: number): Promise<UserRolesEntity> {
        return (await this.userRolesRepository.createQueryBuilder('user_roles'))
            .leftJoinAndSelect('user_roles.user', 'user')
            .leftJoinAndSelect('user_roles.role', 'roles')
            .where('user_roles.userId = :user_id', { 'user_id': userId })
            .andWhere('user_roles.roleId = :role_id', { 'role_id': roleId })
            .getOne();
    }

    /* Create a new role entity provided RoleUserDto { userId, roleId } */
    public async assignRoleToUser(dto: CreateUserRolesDto): Promise<UserRolesEntity> {
        return await this.userRolesRepository.save(new UserRolesEntity(dto));
    }

    /* Remove role entity by id */
    public async deleteRoleFromUser(id: number) { 
        await this.userRolesRepository.delete(id);
    }

    /* 
    **  ~~  [ Validation guard services ]  ~~
    **
    **
    */

    public async validateGlobalRole(username: string, roles: string[]): Promise<boolean> {
        const user: UserEntity = await this.userService.findOneByUsername(username);

        const roles_from_user = await this.getAllRolesFromUser(user.id);
        const roles_array = roles_from_user.map(ur => ur.role);
        console.log('[ validateGlobalRole ]')
        console.log('    -> username : ', username);
        console.log('    -> roles : ', roles_array);
        console.log();
//        console.log(`[ validateGlobalRole ] for user ${username}, these are the roles available in db: ${JSON.stringify(roles_from_user)}, and these are the roles we are checking user against: ${roles}}`);

        const tal = (await this.getAllRolesFromUser(user.id))
            .map(userRole => userRole.role.role)
            .some(role => roles.includes(role));

        console.log('roles: ', roles);
        console.log('mapped: ', roles_from_user.map(ur => ur.role.role));
        console.log('result: ', tal);
        return tal;
    }
}
