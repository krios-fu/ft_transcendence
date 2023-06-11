import { MigrationInterface, QueryRunner } from "typeorm"
import { UserRolesEntity } from "../src/user_roles/entity/user_roles.entity"
import { UserEntity } from "../src/user/entities/user.entity";
import { RolesEntity } from "../src/roles/entity/roles.entity";
import { RoleName } from "./1686493785757-init_roles";

export class initUserRoles1686496939782 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const   adminEntity: UserEntity = await queryRunner.manager
                                                    .getRepository(UserEntity)
                                                    .findOneBy({
                                                        username: "admin"
                                                    });
        const   adminRoleEntity: RolesEntity = await queryRunner.manager
                                                    .getRepository(RolesEntity)
                                                    .findOneBy({
                                                        role: "admin" as RoleName
                                                    });
        
        await queryRunner.manager.getRepository(UserRolesEntity).insert({
            userId: adminEntity.id,
            user: adminEntity,
            roleId: adminRoleEntity.id,
            role: adminRoleEntity,
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(UserRolesEntity).delete({
            userId: (await queryRunner.manager.getRepository(UserEntity)
                                                .findOneBy({
                                                    username: "admin"
                                                })).id
        });
    }

}
