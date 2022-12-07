import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryMapper } from 'src/common/mappers/query.mapper';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RoleQueryDto } from './dto/role.query.dto';
import { RolesEntity } from './entity/roles.entity';
import { RolesRepository } from './repository/roles.repository';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RolesEntity)
        private readonly rolesRepository: RolesRepository,
    ) { }

    public async findAll(queryParams: RoleQueryDto): Promise<RolesEntity[]> {
        if (queryParams !== undefined) {
            return await this.rolesRepository.find(new QueryMapper(queryParams));
        }
        return await this.rolesRepository.find();
    }

    public async findOne(roleId: number): Promise<RolesEntity> {
        const role = await this.rolesRepository.findOne({
            where: { id: roleId },
        });
        return role;
    }

    public async create(dto: CreateRoleDto): Promise<RolesEntity>{
        const roleEntity = new RolesEntity(dto);
        return await this.rolesRepository.save(roleEntity); /* check why not insert */
    }

    public async update(roleId: number, dto: UpdateRoleDto): Promise<RolesEntity> {
        if (await this.findOne(roleId) === null) {
            return null
        }
        const tal = await this.rolesRepository.update(roleId, dto);
        return this.findOne(roleId); /* nooo */
    }

    public async remove(roleId: number): Promise<void> {
        await this.rolesRepository.softDelete(roleId)
    }

    public async findRoleByName(role: string): Promise<RolesEntity> {
        return await this.rolesRepository.findOne({
            where: { role: role },
        });
    }

}
