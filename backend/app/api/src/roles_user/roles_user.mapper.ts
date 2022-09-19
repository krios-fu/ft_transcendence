import { RolesUserDto } from "./dto/roles_user.dto";
import { RolesUserEntity } from "./entity/roles_user.entity";

export class RolesUserMapper {
    /* to entity */
    toEntity(rolesUserDto: RolesUserDto): RolesUserEntity {
        const { user_id, role_id } = rolesUserDto;
        return {
            user_id,
            role_id
        };
    }

    toDto() {
        
    }
    /* to dto */
}
