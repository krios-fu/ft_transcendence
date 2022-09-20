import { RolesUserDto } from "./dto/roles_user.dto";
import { RolesUserEntity } from "./entities/roles_user.entity";


export class RolesUserMapper {
    toEntity(rolesUserDto: RolesUserDto): RolesUserEntity {
        const { user_id, role_id } = rolesUserDto;
        const rolesUserEntity = new RolesUserEntity(user_id, role_id);

        return rolesUserEntity;
    }

    toDto(rolesUserEntity: RolesUserEntity): RolesUserDto {
        const { user_id, role_id } = rolesUserEntity;
        return {
            user_id: user_id,
            role_id: role_id,
        };
    }
}
