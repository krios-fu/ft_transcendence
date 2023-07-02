import { MigrationInterface, QueryRunner } from "typeorm"
import { RolesEntity } from "../src/roles/entity/roles.entity";

export type RoleName =
    "super-admin"
    | "admin"
    | "private"
    | "banned"
    | "silenced";

export class initRoles1686493785757 implements MigrationInterface {
    name = 'initRoles1686493785757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(RolesEntity).insert([
            {
                role: "super-admin" as RoleName
            },
            {
                role: "admin" as RoleName
            },
            {
                role: "private" as RoleName
            },
            {
                role: "official" as RoleName
            },
            {
                role: "banned" as RoleName
            },
            {
                role: "silenced" as RoleName
            }
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const roleNames: RoleName[] = [
            "super-admin",
            "admin",
            "private",
            "banned",
            "silenced"
        ];

        for (const roleName of roleNames) {
            await queryRunner.manager.getRepository(RolesEntity).delete({
                role: roleName
            });
        }
    }

}
