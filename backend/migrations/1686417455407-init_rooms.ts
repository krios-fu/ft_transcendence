import { MigrationInterface, QueryRunner } from "typeorm"
import { RoomEntity } from "../src/room/entity/room.entity"
import { UserEntity } from "../src/user/entities/user.entity";
import { CreatorUsername } from "./1686412674045-init_users";

export type    RoomName = "atlantis" |
                            "metropolis" |
                            "wakanda";

function    getCreator(creators: UserEntity[],
                        targetUsername: CreatorUsername): UserEntity {
    return (
        creators.find(creator => creator.username === targetUsername)
    );
}

export class initRooms1686417455407 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const   creatorEntities: UserEntity[] = await queryRunner.manager
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
    
        await queryRunner.manager.getRepository(RoomEntity).insert([
            {
                roomName: "atlantis" as RoomName,
                ownerId: getCreator(creatorEntities, "onapoli-").id,
                photoUrl: "http://localhost:3000/static/rooms/atlantis.png",
                owner: getCreator(creatorEntities, "onapoli-"),
            },
            {
                roomName: "metropolis" as RoomName,
                ownerId: getCreator(creatorEntities, "krios-fu").id,
                photoUrl: "http://localhost:3000/static/rooms/metropolis.png",
                owner: getCreator(creatorEntities, "krios-fu"),
            },
            {
                roomName: "wakanda" as RoomName,
                ownerId: getCreator(creatorEntities, "danrodri").id,
                photoUrl: "http://localhost:3000/static/rooms/wakanda.png",
                owner: getCreator(creatorEntities, "danrodri"),
            }
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const   roomNames: RoomName[] = [
            "atlantis",
            "metropolis",
            "wakanda"
        ];
    
        for (const roomName of roomNames)
        {
            await queryRunner.manager.getRepository(RoomEntity).delete({
                roomName: roomName
            });
        }
    }

}
