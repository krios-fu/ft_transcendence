import { Delete, Get, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RolesUserService } from './roles_user.service';

@Controller('roles_user')
export class RolesUserController {
    constructor(
        private readonly rolesUserService: RolesUserService
    ) { }
        @Get()
        async getRoleUser() {
            this.rolesUserService.getRoleUser();
        }

        @Get('/users/:user_id')
        async getAllRolesFromUser() {
            this.rolesUserService.getAllRolesFromUser();
        }

        @Get('/roles/:role_id')
        async getUsersWithRole() {
            this.rolesUserService.getUsersWithRole();
        }

        @Post()
        async assignRoleToUser() { 
            this.rolesUserService.assignRoleToUser();
        }

        @Delete(':id')
        aysnc deleteRoleFromUser() { 
            this.rolesUserService.deleteRoleFromUser();
        }
}
