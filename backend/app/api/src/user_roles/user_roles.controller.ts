import { Body, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserRolesDto } from './dto/user_roles.dto';
import { UserRolesEntity } from './entity/user_roles.entity';
import { UserRolesService } from './user_roles.service';

@Controller('user_roles')
export class UserRolesController {
    constructor(
        private readonly userRolesService: UserRolesService,
        private readonly userService: UserService,
    ) { }

    private readonly userRolesLogger: Logger;
    /* Get all users with roles */
    @Get()
    public async getAllUserRoles(@Query() queryParams): Promise<UserRolesEntity[]> {
        return await this.userRolesService.getAllUserRoles(/* gbys */);
    }
    /* Get an user with a role */
    @Get(':id')
    public async getUserRole(@Param('id', ParseIntPipe) id: number): Promise<UserRolesEntity> {
        const userRole = await this.userRolesService.findOne(id);
        if (userRole === null) {
            this.userRolesLogger.error('No user role with id ' + id + ' found in database');
            throw new HttpException('no user role in db', HttpStatus.NOT_FOUND);
        }
        return userRole;
    }

    /* Get all roles from user */
    @Get('/users/:user_id')
    public async getAllRolesFromUser(@Param('user_id', ParseIntPipe) userId: number): Promise<UserRolesEntity[]> {
        if (await this.userService.findOne(userId) === null) {
            this.userRolesLogger.error('User with id ' + userId + ' not found in database');
            throw new HttpException('no user in db', HttpStatus.NOT_FOUND);
        }
        return this.userRolesService.getAllRolesFromUser(userId);
    }

    /* Get all users with a role */
    @Get('/roles/:role_id')
    public async getUsersWithRole(@Param('role_id', ParseIntPipe) roleId: number): Promise<UserRolesEntity[]> {
        if (await this.userService.findOne(roleId) === null) {
            this.userRolesLogger.error('Role with id ' + roleId + ' not found in database');
            throw new HttpException('no role in db', HttpStatus.NOT_FOUND);
        }
        return this.userRolesService.getUsersWithRole(roleId);
    }

    /* Create a new role for a user */
    /* at least web admin */
    @Post()
    public async assignRoleToUser(@Body() dto: CreateUserRolesDto): Promise<UserRolesEntity> {
        const { userId, roleId } = dto;
        if (await this.userRolesService.findByUserRoleIds(userId, roleId) !== null) {
            this.userRolesLogger.error('User ' + userId + ' with role ' + roleId + ' already present in database');
            throw new HttpException('user role already in db', HttpStatus.BAD_REQUEST);
        }
        return this.userRolesService.assignRoleToUser(dto);
    }

    /* Remove a role from a user */
    /* at least web admin */
    @Delete(':id')
    public async deleteRoleFromUser(@Param('id', ParseIntPipe) id: number): Promise<void> { 
        await this.userRolesService.deleteRoleFromUser(id);
    }
}
