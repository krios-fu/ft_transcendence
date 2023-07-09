import { MigrationInterface, QueryRunner } from "typeorm"
import { UserRoomEntity } from "../src/user_room/entity/user_room.entity"
import { UserRoomRolesEntity } from "../src/user_room_roles/entity/user_room_roles.entity";

export class initUserRoomRoles1687693389363 implements MigrationInterface {
    name = 'initUserRoomRoles1687693389363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const   userRoomEntities: UserRoomEntity[] =
                        await queryRunner.manager
                            .getRepository(UserRoomEntity)
                            .findBy([
                                {
                                    userId: 1
                                },
                                {
                                    userId: 2
                                },
                                {
                                    userId: 3
                                }
                            ]);
        
        for (const userRoom of userRoomEntities) {
            await queryRunner.manager.getRepository(UserRoomRolesEntity).save(
                new UserRoomRolesEntity({
                    userRoomId: userRoom.id,
                    roleId: 2 //admin
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
