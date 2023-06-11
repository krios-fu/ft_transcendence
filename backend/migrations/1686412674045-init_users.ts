import { MigrationInterface, QueryRunner } from "typeorm"
import { UserEntity } from "../src/user/entities/user.entity"
import { Category } from "../src/user/enum/category.enum";

export class initUsers1686412674045 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(UserEntity).insert([
            {
                username: "admin",
                firstName: "admin",
                lastName: "admin",
                email: "mail@mail.com",
                photoUrl: "",
                profileUrl: "",
                nickName: "admin",
                doubleAuth: true,
                doubleAuthSecret: "", //variable de entorno
                defaultOffline: true,
                ranking: 0,
                category: Category.Iron
            }
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(UserEntity).delete({
            username: "admin"
        });
    }

}
