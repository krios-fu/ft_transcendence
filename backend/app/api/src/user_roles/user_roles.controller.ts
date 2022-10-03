import { Body, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreateUserRolesDto } from './dto/user_roles.dto';
import { UserRolesEntity } from './entity/user_roles.entity';
import { UserRolesService } from './user_roles.service';

@Controller('user_roles')
export class UserRolesController {
    constructor(
        private readonly UserRolesService: UserRolesService
    ) { }

        /* Get an user with a role */
        @Get(':id')
        async getRoleUser(@Param('id', ParseIntPipe) id: number): Promise<UserRolesEntity> {
            return this.UserRolesService.getRoleUser(id);
        }

        /* Get all roles from user */
        @Get('/users/:user_id')
        async getAllRolesFromUser(@Param('user_id') user_id: string): Promise<UserRolesEntity[]> {
            return this.UserRolesService.getAllRolesFromUser(user_id);
        }

        /* Get all users with a role */
        @Get('/roles/:role_id')
        async getUsersWithRole(@Param('role_id') role_id: string): Promise<UserRolesEntity[]> {
            return this.UserRolesService.getUsersWithRole(role_id);
        }

    /* Create a new role for a user */
    /* at least web admin */
        @Post()
        async assignRoleToUser(@Body() UserRolesDto: CreateUserRolesDto): Promise<UserRolesEntity> { 
            return this.UserRolesService.assignRoleToUser(UserRolesDto);
        }

    /* Remove a role from a user */
    /* at least web admin */
        @Delete(':id')
        async deleteRoleFromUser(@Param('id', ParseIntPipe) id: number): Promise<void> { 
            await this.UserRolesService.deleteRoleFromUser(id);
        }
}
