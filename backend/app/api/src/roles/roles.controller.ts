import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/role.dto';
import { RolesEntity } from './entity/roles.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  /* Create a new role */
  @Post()
  create(@Body() createRoleDto: RoleDto): Promise<RolesEntity> {
    return this.rolesService.create(createRoleDto);
  }

  /* Get all roles */
  @Get()
  findAll(): Promise<RolesEntity[]> {
    return this.rolesService.findAll();
  }

  /* Get a role */
  @Get(':role_id')
  findOne(@Param('role_id') role_id: string): Promise<RolesEntity> {
    return this.rolesService.findOne(role_id);
  }

  /* Update a role */
  /* 
   * @UseGuard(RoleGuard)
   * @Decorator(scope, role)
   */
  @Patch(':role_id')
  update(@Param('role_id') role_id: string, @Body() updateRoleDto: RoleDto): Promise<RolesEntity> {
    return this.rolesService.update(role_id, updateRoleDto);
  }

  /* Delete a role */
  @Delete(':role_id')
  remove(@Param('role_id') role_id: string): Promise<void> {
    return this.rolesService.remove(role_id);
  }
}
