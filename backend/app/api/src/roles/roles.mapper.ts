import { Injectable } from "@nestjs/common";
import { RoleDto } from "./dto/role.dto";
import { RolesEntity } from "./entities/roles.entity";

@Injectable()
export class RolesMapper {
    toDto(rolesEntity: RolesEntity): RoleDto {
        return { role: rolesEntity.role }
    }

    toEntity(roleDto: RoleDto): RolesEntity {
        const rolesEntity = new RolesEntity ( roleDto.role ); /* esto es mentira */
        return rolesEntity;
    }
}