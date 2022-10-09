import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RolesEntity } from './entity/roles.entity';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    /* Create a new role */
    @Post()
    public async create(@Body() createRoleDto: CreateRoleDto): Promise<RolesEntity> {
        return await this.rolesService.create(createRoleDto);
    }

    /* Get all roles */
    @Get()
    public async findAll(): Promise<RolesEntity[]> {
        return await this.rolesService.findAll();
    }

    /* Get a role */
    @Get(':role_id')
    public async findOne(@Param('role_id') role_id: string): Promise<RolesEntity> {
        const role = await this.rolesService.findOne(role_id);
        if (role === null) {
            throw new HttpException('no role in db', HttpStatus.NOT_FOUND);
        }
        return role;
    }

    /* Update a role */
    /* 
    * @UseGuard(RoleGuard)
    * @Decorator(scope, role)
    */
    @Patch(':role_id')
    public async update
    (
        @Param('role_id') roleId: string, 
        @Body() updateRoleDto: UpdateRoleDto
    ): Promise<RolesEntity> {
        return await this.rolesService.update(roleId, updateRoleDto);
    }

    /* Delete a role */
    @Delete(':role_id')
    public async remove(@Param('role_id') roleId: string): Promise<void> {
        return await this.rolesService.remove(roleId);
    }
}
