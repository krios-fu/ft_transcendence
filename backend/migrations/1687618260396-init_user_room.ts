import { InsertResult, MigrationInterface, QueryRunner } from "typeorm";
import { UserEntity } from "../src/user/entities/user.entity";
import { CreatorUsername } from "./1686412674045-init_users";
import { UserRoomEntity } from "../src/user_room/entity/user_room.entity";
import { RoomName } from "./1686417455407-init_rooms";
import { RoomEntity } from "../src/room/entity/room.entity";

function    getCreator(creators: UserEntity[],
                        targetUsername: CreatorUsername): UserEntity {
    return (
        creators.find(creator => creator.username === targetUsername)
    );
}

export class initUserRoom1687618260396 implements MigrationInterface {
    name = 'initUserRoom1687618260396'

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
        const   roomEntities: RoomEntity[] = await queryRunner.manager
                    .getRepository(RoomEntity)
                    .findBy([
                        {
                            roomName: "atlantis" as RoomName
                        },
                        {
                            roomName: "metropolis" as RoomName
                        },
                        {
                            roomName: "wakanda" as RoomName
                        }
                    ]);
        const   pairs: Map<RoomName, CreatorUsername> = new Map([
            ["atlantis", "onapoli-"],
            ["metropolis", "krios-fu"],
            ["wakanda", "danrodri"]
        ]);
        let userRoomEntity: UserRoomEntity;
    
        for (const room of roomEntities) {
            userRoomEntity = new UserRoomEntity({
                userId: getCreator(creatorEntities,
                                    pairs.get(room.roomName as RoomName)).id,
                roomId: room.id
            });
            room.userRoom = [userRoomEntity];
            await queryRunner.manager.getRepository(RoomEntity).save(room);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
