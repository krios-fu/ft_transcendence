import { MigrationInterface, QueryRunner } from "typeorm"
import { RoomRolesEntity } from "../src/room_roles/entity/room_roles.entity"
import { RoomEntity } from "../src/room/entity/room.entity";
import { RoomName } from "./1686417455407-init_rooms";
import { RolesEntity } from "../src/roles/entity/roles.entity";
import { RoleName } from "./1686493785757-init_roles";

export class initRoomRoles1686498635446 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const   roomEntities: RoomEntity[] = await queryRunner.manager
                                                    .getRepository(RoomEntity)
                                                    .find({
            where: [
                {
                    roomName: "atlantis" as RoomName
                },
                {
                    roomName: "metropolis" as RoomName
                },
                {
                    roomName: "wakanda" as RoomName
                }
            ]
        });
        const   officialRoleEntity: RolesEntity = await queryRunner.manager
                                                    .getRepository(RolesEntity)
                                                    .findOneBy({
            role: "official" as RoleName
        });

        for (const room of roomEntities)
        {
            queryRunner.manager.getRepository(RoomRolesEntity).insert([
                {
                    roomId: room.id,
                    room: room,
                    roleId: officialRoleEntity.id,
                    role: officialRoleEntity
                }
            ]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const   roomIds: number[] = [];
        
        roomIds.push(...
            (await queryRunner.manager.getRepository(RoomEntity).find({
                where: [
                    {
                        roomName: "atlantis" as RoomName
                    },
                    {
                        roomName: "metropolis" as RoomName
                    },
                    {
                        roomName: "wakanda" as RoomName
                    }
                ]
            })).map(room => {
                return (room.id)
            })
        );
        queryRunner.manager.getRepository(RoomRolesEntity).delete(roomIds);
    }

}
