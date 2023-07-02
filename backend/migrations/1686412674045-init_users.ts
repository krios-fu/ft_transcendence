import { MigrationInterface, QueryRunner } from "typeorm"
import { UserEntity } from "../src/user/entities/user.entity"
import { Category } from "../src/user/enum/category.enum";

export type CreatorUsername = "krios-fu"
                            | "danrodri"
                            | "onapoli-";

export class initUsers1686412674045 implements MigrationInterface {
    name = 'initUsers1686412674045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(UserEntity).insert([
            {
                username: "danrodri" as CreatorUsername,
                firstName: "Daniel",
                lastName: "Rodriguez",
                email: "danrodri@student.42madrid.com",
                photoUrl: "http://localhost:3000/static/users/danrodri.jpg",
                profileUrl: "https://profile.intra.42.fr/users/danrodri",
                nickName: "danrodri",
                doubleAuth: false,
                doubleAuthSecret: null,
                defaultOffline: false,
                ranking: 1500,
                category: Category.Pending
            },
            {
                username: "krios-fu" as CreatorUsername,
                firstName: "Kevin",
                lastName: "Rios",
                email: "krios-fu@student.42madrid.com",
                photoUrl: "http://localhost:3000/static/users/krios-fu.jpeg",
                profileUrl: "https://profile.intra.42.fr/users/krios-fu",
                nickName: "krios-fu",
                doubleAuth: false,
                doubleAuthSecret: null,
                defaultOffline: false,
                ranking: 1500,
                category: Category.Pending
            },
            {
                username: "onapoli-" as CreatorUsername,
                firstName: "Omar",
                lastName: "Napoli",
                email: "onapoli-@student.42madrid.com",
                photoUrl: "http://localhost:3000/static/users/onapoli-.jpeg",
                profileUrl: "https://profile.intra.42.fr/users/onapoli-",
                nickName: "onapoli-",
                doubleAuth: false,
                doubleAuthSecret: null,
                defaultOffline: false,
                ranking: 1500,
                category: Category.Pending
            }
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const   creatorIds: number[] = (await queryRunner.manager
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
    
        await queryRunner.manager.getRepository(UserEntity).delete(
            creatorIds
        );
    }

}
