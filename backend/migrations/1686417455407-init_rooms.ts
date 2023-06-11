import { MigrationInterface, QueryRunner } from "typeorm"
import { RoomEntity } from "../src/room/entity/room.entity"
import { UserEntity } from "../src/user/entities/user.entity";

export type    RoomName = "atlantis" |
                            "metropolis" |
                            "wakanda";

export class initRooms1686417455407 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const   adminEntity: UserEntity = await queryRunner.manager
                                                    .getRepository(UserEntity)
                                                    .findOneBy({id: 1});
    
        await queryRunner.manager.getRepository(RoomEntity).insert([
            {
                roomName: "atlantis" as RoomName,
                ownerId: adminEntity.id,
                photoUrl: "a",
                owner: adminEntity,
            },
            {
                roomName: "metropolis" as RoomName,
                ownerId: adminEntity.id,
                photoUrl: "b",
                owner: adminEntity,
            },
            {
                roomName: "wakanda" as RoomName,
                ownerId: adminEntity.id,
                photoUrl: "c",
                owner: adminEntity,
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
