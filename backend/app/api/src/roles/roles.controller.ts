import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe, Logger, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RolesEntity } from './entity/roles.entity';
import { RoleQueryDto } from './dto/role.query.dto';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { 
        this.roleLogger = new Logger(RolesController.name);
    }
    private readonly roleLogger: Logger;

    /* Get all roles */
    @Get()
    public async findAll(@Query() queryParams: RoleQueryDto): Promise<RolesEntity[]> {
        console.log('query tal: ' + JSON.stringify(queryParams));
        return await this.rolesService.findAll(queryParams);
    }

    /* Get a role */
    @Get(':role_id')
    public async findOne(@Param('role_id', ParseIntPipe) roleId: number): Promise<RolesEntity> {
        const role = await this.rolesService.findOne(roleId);
        if (role === null) {
            this.roleLogger.error('No role with id ' + roleId + ' in database');
            throw new HttpException('no role in db', HttpStatus.NOT_FOUND);
        }
        return role;
    }

    /* Create a new role */
    @Post()
    public async create(@Body() dto: CreateRoleDto): Promise<RolesEntity> {
        if (await this.rolesService.findRoleByName(dto.role) !== null) {
            this.roleLogger.error('Role with id ' + dto.role + ' is already in database');
            throw new HttpException('role already in db', HttpStatus.BAD_REQUEST);
        }
        return await this.rolesService.create(dto);
    }

    /* Update a role */
    /* 
    * @UseGuard(RoleGuard)
    * @Decorator(scope, role)
    */
    @Patch(':role_id')
    public async update
    (
        @Param('role_id', ParseIntPipe) roleId: number, 
        @Body() updateRoleDto: UpdateRoleDto
    ): Promise<RolesEntity> {
        return await this.rolesService.update(roleId, updateRoleDto);
    }

    /* Delete a role */
    @Delete(':role_id')
    public async remove(@Param('role_id', ParseIntPipe) roleId: number): Promise<void> {
        return await this.rolesService.remove(roleId);
    }
}
