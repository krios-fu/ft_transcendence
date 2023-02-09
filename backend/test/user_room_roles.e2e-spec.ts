import {INestApplication} from "@nestjs/common";
import {getCredentials, moduleConfig} from "./utils/test.utils";
import {Test, TestingModule} from "@nestjs/testing";
import {UserRoomRolesModule} from "../src/user_room_roles/user_room_roles.module";
import {AuthModule} from "../src/auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import { request } from "http";
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
    authToken = await getCredentials(app);
});

describe('/user_room_roles (e2e)', () => {
    describe( '[ GET /user_room_roles/ ] ', () => {
        it ('[ Empty response petition ]', () => {
            return (app.getHttpServer())
                .get('/user_room_roles')
                .expect(res => {
                    res.statusCode = 200;
                    res.body.length = 0;
                    res.body.containsEql([]);
                });
        });

        it ('[ Should return one entity ]', () => {
            const user_room_role = { userId: user_id, roomId: room_id, roleId: role_id }; /* values are  placeholders */
            /* DB_FEED: one user, one role, one room, one user_room_role */
            return (app.getHttpServer())
                .get('/user_room_roles')
                .expect(res => {
                    res.statusCode = 200;
                    res.body.length = 1;
                    res.body.containsEql(user_room_role);
                });
        });

        it ('[ Should return more than one entity ]', () => {
            const user_room_roles = [
                { userId: user_id, roomId: room_id, roleId: role_id },
                { userId: user_id, roomId: room_id, roleId: role_id },
                { userId: user_id, roomId: room_id, roleId: role_id },
            ]; /* values are  placeholders */
            /* DB_FEED: three user, two role, one room, three user_room_role */
            return (app.getHttpServer())
                .get('/user_room_roles')
                .expect(res => {
                    res.statusCode = 200;
                    res.body.length = 3;
                    res.body.containsEql(user_room_roles);
                });
        });
    });

    describe( '[ GET /user_room_roles/:id ] ', () => {
        it('[ 404 response (no entity associated with id) ]', () => {
            return (app.getHttpServer())
                .get(`/user_room_roles/${id}`)
                .expect(res => res.statusCode = 404);
        });

        it('[ Get one entity ]', () => {
            const user_room_role = { userId: user_id, roomId: room_id, roleId: role_id }; /* values are  placeholders */
            /* DB_FEED: one user, one room, one role, one user_room_role */
            return (app.getHttpServer())
                .get(`/user_room_roles/${id}`)
                .expect(res => {
                    res.statusCode = 200;
                    res.body.containsEql(user_room_role);
                });
        });
    });

    describe( '[ GET /user_room_roles/rooms/:room_id ] ', () => {
        it('[ Should return a 400 (room does not exist) ]', () => {

        });

        it('[ Should return one entity ]', () => {

        });

        it('[ Should return an array of user_room entites ]', () => {

        });
    });

    describe( '[ GET /user_room_roles/rooms/:room_id/roles/:role_id ] ', () => {
        it('[ Petition to a non existent room, should return 400 ]', () => {
            return (app.getHttpServer())
                .get( ``)            
                .expect();
        });

        it('[ Petition with a non existent role, should return 400 ]', () => {
            return (app.getHttpServer())
                .get( ``)
                .expect();
        });

        it('[ Petition to a room with no requested roles ]', () => {
            return (app.getHttpServer())
                .get( ``)
                .expect();
        });

        it('[ Petition to a room with one user with petition role ]', () => {
            return (app.getHttpServer())
                .get( ``)
                .expect();
        });

        it('[ Petition to a room with multiple users with role ]', () => {
            return (app.getHttpServer())
                .get( ``)
                .expect();
        });
    });

    describe('[ POST /user_room_roles ]', () => {
        it('[ Post without room owner, mod or admin credentials ]', () => {
            return (app.getHttpServer())
                .post('/user_room_roles')
                .data(...)
                .expect();
        });

        it('[ Post with room owner creds ]', () => {
            return (app.getHttpServer())
                .post('/user_room_roles')
                .data(...)
                .expect();
        });

        it('[ Post with mod credentials ]', () => {
            return (app.getHttpServer())
                .post('/user_room_roles')
                .data(...)
                .expect();
        });

        it('[ Post with admin creds ]', () => {
            return (app.getHttpServer())
                .post('/user_room_roles')
                .data(...)
                .expect();
        });

        it('[ Post with non existent user_room ]', () => {
            return (app.getHttpServer())
                .post('/user_room_roles')
                .data(...)
                .expect();
        });

        it('[ Post with non existent role ]', () => {
            return (app.getHttpServer())
                .post('/user_room_roles')
                .data(...)
                .expect();
        });
    });

    describe('[ DEL /user_room_roles/:id ]', () => {
        it('[ delete without right credentials ]', () => {
            return (app.getHttpServer())
                .delete(`/user_room_roles/${id}`)
                .expect();
        });

        it('[ delete being an admin ]', () => {
            return (app.getHttpServer())
                .delete(`/user_room_roles/${id}`)
                .expect();
        });

        it('[ delete being an owner ]', () => {
            return (app.getHttpServer())
                .delete(`/user_room_roles/${id}`)
                .expect();
        });

        it('[ delete being a mod ]', () => {
            return (app.getHttpServer())
                .delete(`/user_room_roles/${id}`)
                .expect();
        });

        it('[ delete a non existing role ]', () => {
            return (app.getHttpServer())
                .delete(`/user_room_roles/${id}`)
                .expect();
        });

        it('[ delete your own mod role and try a mod operation (should return 403) ]', () => {
            return (app.getHttpServer())
                .delete(`/user_room_roles/${id}`)
                .expect();
        });
    });
});
