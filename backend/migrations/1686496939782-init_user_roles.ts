import { MigrationInterface, QueryRunner } from "typeorm"
import { UserRolesEntity } from "../src/user_roles/entity/user_roles.entity"
import { UserEntity } from "../src/user/entities/user.entity";
import { RolesEntity } from "../src/roles/entity/roles.entity";
import { RoleName } from "./1686493785757-init_roles";
import { CreatorUsername } from "./1686412674045-init_users";

export class initUserRoles1686496939782 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const creatorEntities: UserEntity[] = await queryRunner.manager
            .getRepository(UserEntity)
            .findBy([
                {
                    username: "danrodri" as CreatorUsername
                },
                {
                    username: "krios-fu" as CreatorUsername
                },
                {
                    username: "onapoli-" as CreatorUsername
                }
            ]);
        const adminRoleEntity: RolesEntity = await queryRunner.manager
            .getRepository(RolesEntity)
            .findOneBy({
                role: "super-admin" as RoleName
            });

        await queryRunner.manager.getRepository(UserRolesEntity).insert(
            creatorEntities.map(creator => {
                return ({
                    userId: creator.id,
                    user: creator,
                    roleId: adminRoleEntity.id,
                    role: adminRoleEntity,
                })
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const creatorIds: number[] = (await queryRunner.manager
            .getRepository(UserEntity)
            .find({
                where: [
                    {
                        username: "krios-fu" as CreatorUsername
                    },
                    {
                        username: "danrodri" as CreatorUsername
                    },
                    {
                        username: "onapoli-" as CreatorUsername
                    }
                ]
            })).map((user: UserEntity) => {
                return (user.id);
            });
        const userRoleIds: number[] = (await queryRunner.manager
            .getRepository(UserRolesEntity)
            .find({
                where: creatorIds.map(id => {
                    return ({
                        id: id
                    });
                })
            })).map(userRoleEntity => {
                return (userRoleEntity.id);
            });

        await queryRunner.manager.getRepository(UserRolesEntity).delete(
            userRoleIds
        );
    }

}
