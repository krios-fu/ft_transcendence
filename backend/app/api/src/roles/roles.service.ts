import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
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

  public async create(dto: CreateRoleDto): Promise<RolesEntity>{
      const roleEntity = this.rolesMapper.toEntity(dto);

      return await this.rolesRepository.save(roleEntity);
  }

  public async findAll(): Promise<RolesEntity[]> {
      return await this.rolesRepository.find();
  }

  public async findOne(role_id: string): Promise<RolesEntity> {
      return await this.rolesRepository.findOne({
        where: { role: role_id },
      });
  }

  public async update(role_id: string, dto: UpdateRoleDto): Promise<RolesEntity> {
      await this.rolesRepository.update(role_id, dto);
      return this.rolesRepository.findOne({
        where: { role: role_id }
      });
  }

  public async remove(role_id: string): Promise<void> {
      await this.rolesRepository.delete(role_id)
  }
}
