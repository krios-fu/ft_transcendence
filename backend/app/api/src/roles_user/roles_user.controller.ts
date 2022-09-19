import { Body, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RolesUserDto } from './dto/roles_user.dto';
import { RolesUserEntity } from './entity/roles_user.entity';
import { RolesUserService } from './roles_user.service';

@Controller('roles_user')
export class RolesUserController {
    constructor(
        private readonly rolesUserService: RolesUserService
    ) { }
        @Get(':id')
        async getRoleUser(@Param('id', ParseIntPipe) id: number): Promise<RolesUserEntity> {
            return this.rolesUserService.getRoleUser(id);
        }

        @Get('/users/:user_id')
        async getAllRolesFromUser(@Param() user_id: string): Promise<RolesUserEntity[]> {
            return this.rolesUserService.getAllRolesFromUser(user_id);
        }

        @Get('/roles/:role_id')
        async getUsersWithRole(@Param() role_id: string): Promise<RolesUserEntity[]> {
            return this.rolesUserService.getUsersWithRole(role_id);
        }

        @Post()
        async assignRoleToUser( @Body() rolesUserDto: RolesUserDto): Promise<RolesUserEntity> { 
            return this.rolesUserService.assignRoleToUser();
        }

        @Delete(':id')
        async deleteRoleFromUser(): Promise<void> { 
            await this.rolesUserService.deleteRoleFromUser();
        }
}
