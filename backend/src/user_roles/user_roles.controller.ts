import { Body, 
    Delete, 
    Get, 
    BadRequestException, 
    Logger, 
    NotFoundException, 
    Param, 
    ParseIntPipe, 
    Post, 
    Query, 
    UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RolesService } from 'src/roles/roles.service';
import { UserService } from '../user/services/user.service';
import { CreateUserRolesDto } from './dto/user_roles.dto';
import { UserRolesQueryDto } from './dto/user_roles.query.dto';
import { UserRolesEntity } from './entity/user_roles.entity';
import { SiteAdminGuard } from './guard/site-admin.guard';
import { UserRolesService } from './user_roles.service';

@Controller('user_roles')
export class UserRolesController {
    constructor(
        private readonly userRolesService: UserRolesService,
        private readonly userService: UserService,
        private readonly rolesService: RolesService
    ) { 
        this.userRolesLogger = new Logger(UserRolesController.name);
    }

    private readonly userRolesLogger: Logger;
    /* Get all users with roles */
    @Get()
    public async findAllUserRoles(@Query() queryParams: UserRolesQueryDto): Promise<UserRolesEntity[]> {
        return await this.userRolesService.findAllUserRoles(queryParams);
    }
    /* Get an user with a role */
    @Get(':id')
    public async getUserRole(@Param('id', ParseIntPipe) id: number): Promise<UserRolesEntity> {
        const userRole: UserRolesEntity = await this.userRolesService.findOne(id);

        if (userRole === null) {
            this.userRolesLogger.error(`No user role with id ${id} found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return userRole;
    }

    /* Get all roles from user */
    @Get('/users/:user_id')
    public async getAllRolesFromUser(@Param('user_id', ParseIntPipe) userId: number): Promise<UserRolesEntity[]> {
        if (await this.userService.findOne(userId) === null) {
            this.userRolesLogger.error(`User with id ${userId} not found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userRolesService.getAllRolesFromUser(userId);
    }

    /* Get all users with a role */
    @Get('/roles/:role_id')
    public async getUsersWithRole(@Param('role_id', ParseIntPipe) roleId: number): Promise<UserRolesEntity[]> {
        if (await this.rolesService.findOne(roleId) === null) {
            this.userRolesLogger.error(`Role with id ${roleId} not found in database`);
            throw new NotFoundException('resource not found in database');
        }
        return await this.userRolesService.getUsersWithRole(roleId);
    }

    /* Get a role from user using user and role ids */
    @Get('/users/:user_id/roles/:role_id')
    public async getUserRoleByIds(
        @Param('user_id', ParseIntPipe) userId: number,
        @Param('role_id', ParseIntPipe) roleId: number
    ): Promise<UserRolesEntity> {
        if (await this.userService.findOne(userId) === null ||
            await this.rolesService.findOne(roleId) === null) {
                this.userRolesLogger.error(`Resource not found in database`);
                throw new NotFoundException('resource not found in database');
            }
        return await this.userRolesService.getUserRoleByIds(userId, roleId);
    }

    @UseGuards(SiteAdminGuard)
    @Post()
    public async assignRoleToUser(@Body() dto: CreateUserRolesDto): Promise<UserRolesEntity> {
        const { userId, roleId } = dto;

        if (await this.userService.findOne(userId) === null ||
            await this.rolesService.findOne(roleId) === null) {
                this.userRolesLogger.error(`Resource not found in database`);
                throw new NotFoundException('resource not found in database');
            }
        if (await this.userRolesService. getUserRoleByIds(userId, roleId) !== null) {
            this.userRolesLogger.error(`User ${userId} with role ${roleId} already present in database`);
            throw new BadRequestException('user role already in db');
        }
        return this.userRolesService.assignRoleToUser(dto);
    }

    @UseGuards(SiteAdminGuard)
    @Delete(':id')
    public async deleteRoleFromUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        const role: UserRolesEntity = await this.userRolesService.findOne(id);
        if (!role) {
            this.userRolesLogger.error(`No user role with id ${id} found in database`);
            throw new BadRequestException('resource not found in database');
        }
        await this.userRolesService.deleteRoleFromUser(role);
    }
}
