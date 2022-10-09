import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { RolesEntity } from './entity/roles.entity';
import { RolesRepository } from './repository/roles.repository';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RolesEntity)
        private readonly rolesRepository: RolesRepository,
    ) { 
        this.roleLogger = new Logger(RolesService.name);
    }
    private readonly roleLogger: Logger;

    public async create(dto: CreateRoleDto): Promise<RolesEntity>{
        const roleEntity = new RolesEntity(dto);

        /* check if role already exists */
        return await this.rolesRepository.save(roleEntity); /* check why not insert */
    }

    public async findAll(): Promise<RolesEntity[]> {
        return await this.rolesRepository.find();
    }

    public async findOne(roleId: string): Promise<RolesEntity> {
        const role = await this.rolesRepository.findOne({
            where: { role: roleId },
        });
        if (role === null) {
            this.roleLogger.error('No role with id ' + roleId + ' in database');
        }
        return role;
    }

    public async update(roleId: string, dto: UpdateRoleDto): Promise<RolesEntity> {
        await this.rolesRepository.update(roleId, dto);
        return this.rolesRepository.findOne({
            where: { role: roleId }
        });
    }

    public async remove(roleId: string): Promise<void> {
        await this.rolesRepository.delete(roleId)
    }
}
