import { Body, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RolesUserDto } from './dto/user_roles.dto';
import { RolesUserEntity } from './entity/user_roles.entity';
import { RolesUserService } from './user_roles.service';

@Controller('user_roles')
export class RolesUserController {
    constructor(
        private readonly rolesUserService: RolesUserService
    ) { }

        /* Get an user with a role */
        @Get(':id')
        async getRoleUser(@Param('id', ParseIntPipe) id: number): Promise<RolesUserEntity> {
            return this.rolesUserService.getRoleUser(id);
        }

        /* Get all roles from user */
        @Get('/users/:user_id')
        async getAllRolesFromUser(@Param('user_id') user_id: string): Promise<RolesUserEntity[]> {
            return this.rolesUserService.getAllRolesFromUser(user_id);
        }

        /* Get all users with a role */
        @Get('/roles/:role_id')
        async getUsersWithRole(@Param('role_id') role_id: string): Promise<RolesUserEntity[]> {
            return this.rolesUserService.getUsersWithRole(role_id);
        }

    /* Create a new role for a user */
    /* at least web admin */
        @Post()
        async assignRoleToUser(@Body() rolesUserDto: RolesUserDto): Promise<RolesUserEntity> { 
            return this.rolesUserService.assignRoleToUser(rolesUserDto);
        }

    /* Remove a role from a user */
    /* at least web admin */
        @Delete(':id')
        async deleteRoleFromUser(@Param('id', ParseIntPipe) id: number): Promise<void> { 
            await this.rolesUserService.deleteRoleFromUser(id);
        }
}
