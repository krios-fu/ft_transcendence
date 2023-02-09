import {INestApplication} from "@nestjs/common";
import {getCredentials, moduleConfig} from "./utils/test.utils";
import {Test, TestingModule} from "@nestjs/testing";
import {UserRoomRolesModule} from "../src/user_room_roles/user_room_roles.module";
import {AuthModule} from "../src/auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
export const getUserRoomRolesQuery  = queryParams => queryParams.map(
    qp, `INSERT INTO user_roles (userRoomId, roomId) VALUES (${qp.userRoomId},${qp.roleId});`
).reduce((qTotal, q) => qTotal + q, '');

let app: INestApplication;
let authToken: string = '';

beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot(moduleConfig),
            AuthModule,
            UserRoomRolesModule,
        ],
    }).compile()
    app = testModule.createNestApplication();
    await app.init()
    authToken = await getCredentials();
});

describe('/user_room_roles (e2e)', () => {
    describe( '[ GET /user_room_roles/ ] ', () => {
        it ('[ Empty response petition ]', () => {

        });

        it ('[ Should return one entity ]', () => {

        });

        it ('[ Should return more than one entity ]', () => {

        });
    });

    describe( '[ GET /user_room_roles/:id ] ', () => {
        it('[404 response (no entity associated with id)]', () => {

        });

        it('[one entity]', () => {

        });
    });

    describe( '[ GET /user_room_roles/rooms/:room_id ] ', () => {
        it('[should return a 400 (room does not exist)]', () => {

        });

        it('[should return one entity]', () => {

        });

        it('[should return an array of user_room entites]', () => {

        });
    });

    describe( '[ GET /user_room_roles/rooms/:room_id/roles/:role_id ] ', () => {
        it('[petition to a non existent room, should return 400]', () => {

        });

        it('[petition with a non existent role, should return 400]', () => {

        });

        it('[petition to a room with no requested roles]', () => {

        });

        it('[petition to a room with one user with petition role]', () => {

        });

        it('[petition to a room with multiple users with role]', () => {

        });
    });

    describe('[ POST /user_room_roles ]', () => {
        it('[post without room owner, mod or admin credentials]', () => {

        });

        it('[post with room owner creds]', () => {

        });

        it('[post with mod credentials]', () => {

        });

        it('[post with admin creds]', () => {

        });

        it('[post with non existent user_room]', () => {

        });

        it('[post with non existent role]', () => {

        });
    });

    describe('[ DEL /user_room_roles/:id ]', () => {
        it('[ delete without right credentials ]', () => {

        });

        it('[ delete being an admin ]', () => {

        });

        it('[ delete being an owner ]', () => {

        });

        it('[ delete being a mod ]', () => {

        });

        it('[ delete a non existing role ]', () => {

        });

        it('[ delete your own mod role and try a mod operation (should return 403) ]', () => {

        });
    });
});
