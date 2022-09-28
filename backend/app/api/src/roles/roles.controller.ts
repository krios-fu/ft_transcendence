import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/role.dto';
import { RolesEntity } from './entity/roles.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: RoleDto): Promise<RolesEntity> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll(): Promise<RolesEntity[]> {
    return this.rolesService.findAll();
  }

  @Get(':role_id')
  findOne(@Param('role_id') role_id: string): Promise<RolesEntity> {
    return this.rolesService.findOne(role_id);
  }

  @Patch(':role_id')
  update(@Param('role_id') role_id: string, @Body() updateRoleDto: RoleDto): Promise<RolesEntity> {
    return this.rolesService.update(role_id, updateRoleDto);
  }

  @Delete(':role_id')
  remove(@Param('role_id') role_id: string): Promise<void> {
    return this.rolesService.remove(role_id);
  }
}
