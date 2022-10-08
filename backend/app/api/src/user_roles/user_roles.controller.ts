import { Body, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateUserRolesDto } from './dto/user_roles.dto';
import { UserRolesEntity } from './entity/user_roles.entity';
import { UserRolesService } from './user_roles.service';

@Controller('user_roles')
export class UserRolesController {
    constructor(
        private readonly userRolesService: UserRolesService
    ) { }

        /* Get all users with roles */
        @Get()
        public async getAllUserRoles(): Promise<UserRolesEntity[]> {
            return await this.userRolesService.getAllUserRoles();
        }
        /* Get an user with a role */
        @Get(':id')
        public async getUserRole(@Param('id', ParseIntPipe) id: number): Promise<UserRolesEntity> {
            return this.userRolesService.getUserRole(id);
        }

        /* Get all roles from user */
        @Get('/users/:user_id')
        public async getAllRolesFromUser(@Param('user_id') user_id: string): Promise<UserRolesEntity[]> {
            return this.userRolesService.getAllRolesFromUser(user_id);
        }

        /* Get all users with a role */
        @Get('/roles/:role_id')
        public async getUsersWithRole(@Param('role_id') role_id: string): Promise<UserRolesEntity[]> {
            return this.userRolesService.getUsersWithRole(role_id);
        }

        /* Create a new role for a user */
        /* at least web admin */
        @Post()
        public async assignRoleToUser(@Body() UserRolesDto: CreateUserRolesDto): Promise<UserRolesEntity> { 
            return this.userRolesService.assignRoleToUser(UserRolesDto);
        }

        /* Remove a role from a user */
        /* at least web admin */
        @Delete(':id')
        public async deleteRoleFromUser(@Param('id', ParseIntPipe) id: number): Promise<void> { 
            await this.userRolesService.deleteRoleFromUser(id);
        }
}
