import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleDto } from './dto/role.dto';
import { RolesEntity } from './entity/roles.entity';
import { RolesRepository } from './repository/roles.repository';
import { RolesMapper } from './roles.mapper';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: RolesRepository,
    private readonly rolesMapper: RolesMapper,
  ) { }

  async create(createRoleDto: RoleDto): Promise<RolesEntity>{
      const roleEntity = this.rolesMapper.toEntity(createRoleDto);

      return await this.rolesRepository.save(roleEntity);
  }

  async findAll(): Promise<RolesEntity[]> {
      return await this.rolesRepository.find();
  }

  async findOne(role_id: string): Promise<RolesEntity> {
      return await this.rolesRepository.findOne({
        where: { role: role_id },
      });
  }

  async update(role_id: string, updateRoleDto: RoleDto):Promise<RolesEntity> {
      await this.rolesRepository.update(role_id, updateRoleDto);
      return this.rolesRepository.findOne({
        where: { role: role_id }
      });
  }

  async remove(role_id: string): Promise<void> {
      await this.rolesRepository.delete(role_id)
  }
}
