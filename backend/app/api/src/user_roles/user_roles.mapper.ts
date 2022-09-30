import { Injectable } from "@nestjs/common";
import { RolesEntity } from "src/roles/entity/roles.entity";
import { UserEntity } from "src/user/user.entity";
import { RolesUserDto } from "./dto/user_roles.dto";
import { RolesUserEntity } from "./entity/user_roles.entity";

@Injectable()
export class RolesUserMapper {
    toEntity(role: RolesEntity, user: UserEntity): RolesUserEntity {
        const rolesUserEntity = new RolesUserEntity(user, role);

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
