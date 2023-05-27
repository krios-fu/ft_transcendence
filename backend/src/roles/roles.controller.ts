import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    NotFoundException,
    BadRequestException,
    HttpStatus, 
    ParseIntPipe, 
    Logger, 
    Query
} from '@nestjs/common';
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
        return await this.rolesService.findAll(queryParams);
    }

    /* Get a role by ID */
    @Get(':role_id([0-9]+)')
    public async findOneById(@Param('role_id', ParseIntPipe) roleId: number): Promise<RolesEntity> {
        const role = await this.rolesService.findOne(roleId);

        if (role === null) {
            this.roleLogger.error(`No role with id ${roleId} in database`);
            throw new NotFoundException('role not found in database');
        }
        return role;
    }

    /* Get a role via role name */
    @Get(':role_name([A-Za-z]+)')
    public async findOneByName(@Param('role_name') roleName: string): Promise<RolesEntity> {
        const role: RolesEntity = await this.rolesService.findByName(roleName);

        if (role === null) {
            this.roleLogger.error(`No role with name ${roleName} in database`);
            throw new NotFoundException('role not found in database');
        }
        return role;
    }

    /* Create a new role */
    @Post()
    public async create(@Body() dto: CreateRoleDto): Promise<RolesEntity> {
        if (await this.rolesService.findRoleByName(dto.role) !== null) {
            this.roleLogger.error(`Role with id ${dto.role} is already in database`);
            throw new BadRequestException('role already exists');
        }
        return await this.rolesService.create(dto);
    }

    /* Update a role */
    @Patch(':role_id')
    public async update
    (
        @Param('role_id', ParseIntPipe) roleId: number, 
        @Body() updateRoleDto: UpdateRoleDto
    ): Promise<RolesEntity> {
        if (await this.rolesService.findOne(roleId) === null) {
            this.roleLogger.error(`No role with id ${roleId} in database`);
            throw new NotFoundException('resource not found in db');
        }
        return await this.rolesService.update(roleId, updateRoleDto);
    }

    /* Delete a role */
    @Delete(':role_id')
    public async remove(@Param('role_id', ParseIntPipe) roleId: number): Promise<void> {
        if (await this.rolesService.findOne(roleId) === null) {
            this.roleLogger.error(`No role with id ${roleId} in database`);
            throw new NotFoundException('resource not found in db');
        }
        return await this.rolesService.remove(roleId);
    }
}
