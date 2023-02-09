import {INestApplication} from "@nestjs/common";
import {getCredentials, moduleConfig} from "./utils/test.utils";
import {UserRolesRepository} from "../src/user_roles/repository/user_roles.repository";
import {Test, TestingModule} from "@nestjs/testing";
import * as request from "supertest";
import {UserRolesModule} from "../src/user_roles/user_roles.module";
import {AuthModule} from "../src/auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "../src/user/repositories/user.repository";
import {RoomRepository} from "../src/room/repository/room.repository";


let authToken: string = '';
let app: INestApplication;
let userRolesRepository: UserRolesRepository;
let userRepository: UserRepository;
let roomRepository: RoomRepository;

const user_id = [0, 1, 2, 3];
const role_id = [0, 1, 2, 3];

const BAD_UR_ID = 27
beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot(moduleConfig),
            AuthModule,
            UserRolesModule,
        ],
    }).compile()
    app = testModule.createNestApplication();
    await app.init()
    authToken = await getCredentials(app);

    userRolesRepository = testModule.get<UserRolesRepository>('UserRolesRepository');
    userRepository = testModule.get<UserRepository>('UserRepository');
    roomRepository = testModule.get<RoomRepository>('RoomRepository');

    /* DB feeding */
    const users = [
        {username: 'user-1',firstName: 'user-fn-1',lastName: 'user-ln-1',profileUrl: null,email: 'user@mail.ru',photoUrl: null},
        {username: 'user-2',firstName: 'user-fn-2',lastName: 'user-ln-2',profileUrl: null,email: 'user@mail.ru',photoUrl: null}
        {username: 'user-3',firstName: 'user-fn-3',lastName: 'user-ln-3',profileUrl: null,email: 'user@mail.ru',photoUrl: null}
    ]
});

describe('/user_roles (e2e)', () => {
    it ('[ placeholder ]', () => {
        expect(1).toBe(1);
    });

    describe('[ GET /user_roles ]', () => {
        it ('[ Should return an empty array ]', () => {
            return request(app.getHttpServer())
                .get('/user_roles')
                .expect((res) => {
                    res.statusCode = 200;
                    res.body.length = 0;
                    res.body.should.containEql([]);
                });
        });

        it ('[ Should return an array of three elements ]', () => {
            const user_roles = [
                { userId: user_id[0], roleId: role_id[0] },
                { userId: user_id[1], roleId: role_id[1] },
                { userId: user_id[2], roleId: role_id[2] }
            ];

            await userRolesRepository.query(genUserRolesQuery(user_roles)); /* ??? */
            return request(app.getHttpServer())
                .get('/user_roles')
                .expect((res) => {
                    res.statusCode = 200;
                    res.body.length = 3
                    res.body.should.containEql(user_roles);
                });
        });
    });

    describe('[ GET /user_roles/:id ]', () => {
        it ('[ Get a non existent user_role entity ]', () => {
            return (request(app.getHttpServer()))
                .get(`/user_roles/${BAD_UR_ID}`)
                .expect(res => res.statusCode = 404);
        });

        it ('[ Should return a valid user_role entity ]', () => {
            const user_roles = { userId: user_id[0], roleId: role_id[0] }

            const raw = await userRolesRepository.query(genUserRolesQuery(user_roles));
            console.log(`Query returns... ${raw}`);
            const id = 1; /* temporal */
            return request(app.getHttpServer())
                .get(`/user_roles/${id}`)
                .expect((res) => {
                    res.statusCode = 200;
                    res.body.containEql(user_roles);
                });
        });
    });

    describe('[ GET /user_roles/users/:user_id ]', () => {
        it ('[ Get role of a non existent user ]', () => {
            return (app.getHttpServer())
                .get('/user_roles/users/${BAD_USER_ID}')
                .expect(res => res.statusCode = 400);
        });

        it ('[ Get an user with no role ]', () => {
            /* DB_SEED: one user */
            return (app.getHttpServer())
                .get(`/user_roles/users/${user_id}`)
                .expect(res => {
                    res.statusCode = 200;
                    res.body.containsEql([]);
                });
        });

        it ('[ Get role of user ]', () => {
            const user_roles = [{userId: user_id, roleId: role_id}];
            /* DB_SEED: one user, one role, one user_role */

            return (app.getHttpServer())
                .get(`/user_roles/users/${user_id}`)
                .expect(res => {
                    res.statusCode = 200;
                    res.body.containsEql(user_roles)
                });
        });

        it ('[ Get multiple roles of user ]', () => {
            const user_roles = [
                {userId: user_id, roleId: role_id_1},
                {userId: user_id, roleId: role_id_2}
            ];
            /* DB_SEED: one user, two roles, two user_roles */

            return (app.getHttpServer())
                .get(`/user_roles/users/${user_id}`)
                .expect(res => {
                    res.statusCode = 200;
                    res.body.containsEql(user_roles);
                });
        });
    });

    describe('[ GET /user_roles/roles/:role_id ]', () => {
        it ('[ Should return a 400 (role does not exist) ]', () => {
            return (app.getHttpServer())
                .get(`/user_roles/roles/${role_id}`)
                .expect(res => res.statusCode = 400);
        });

        it ('[ Should return a 404 (role has no users) ]', () => {
            /* DB_FEED: one role */
            return (app.getHttpServer())
                .get(`/user_roles/roles/${role_id}`)
                .expect(res => {
                    res.statusCode = 200;
                    res.body.containsEql([]);
            })
        });

        it ('[ Should return an user with that role ]', () => {
            const user_role = [{ userId: user_id, roleId: role_id }];

            /* DB_FEED: one role, one user, one user_role */
            return (app.getHttpServer())
                .get(`/user_roles/roles/${role_id}`)
                .expect(res => {
                    res.statusCode = 200;
                    res.body.containsEql(user_role);
                });
        });

        it ('[ Should return an array of multiple users with a role ]', () => {
            const user_roles = [
                {userId: user_id_1, roleId: role_id},
                {userId: user_id_2, roleId: role_id},
                {userId: user_id_3, roleId: role_id},
            ];

            /* DB_FEED: one role, three users, three user_roles */
            return (app.getHttpServer())
                .get(`/user_roles/roles/${role_id}`)
                .expect(res => {
                    res.statusCode = 200;
                    res.body.length = 3;
                    res.body.containsEql(user_roles);
                });
        });
    });

    describe('[ POST /user_roles ]', () => {
        it ('[ Should not post (passing an id with no user) ]', () => {
            const user_role = {userId: user_id, roleId: role_id};
            /* DB_FEED: one role, one user_role (admin) */
            return (app.getHttpServer())
                .post('/user_roles/')
                .expect(res => res.statusCode = 400);
        });

        it ('[ Should not post (passing an id with no role) ]', () => {
            const user_role = {userId: user_id, roleId: role_id};

            /* DB_FEED: one user, one user_role (admin) */
            return (app.getHttpServer())
                .post('/user_roles/')
                .data(user_role)
                .expect(res => res.statusCode = 400);
        });

        it ('[ Should post an user_role ]', () => {
            const user_role = { userId: user_id, roleId: role_id};

            /* DB_FEED: one user, one role, one user_role (admin) */
            return (app.getHttpServer())
                .post('/user_roles/')
                .data(user_role)
                .expect(res => {
                    res.statusCode = 201;
                    res.body.containsEql(user_role);
                });
        });

        it ('[ Should return a 403 (only admins can post role for users) ]', () => {
            const user_role = { userId: user_id, roleId: role_id};

            /* DB_FEED: one user, one role */
            return (app.getHttpServer())
                .post('/user_roles/')
                .data(user_role)
                .expect(res => res.statusCode = 403);
        });

    });

    describe('[ DEL /user_roles/:id ]', () => {
        it ('[ Post while not being an admin: should return a 403 ]', () => {
            /* DB_FEED: one user, one role, one user_role */

            return (app.getHttpServer())
                .delete(`/user_roles/${id}`)
                .expect(res => res.statusCode = 403);
        });

        it ('[ Deleting a non existent user role; should return a 404 ]', () => {
            return (app.getHttpServer())
                .delete(`/user_roles/${id}`)
                .expect(res => res.statusCode = 403);
        });

        it ('[ Delete an user_role ]', () => {
            /* DB_FEED: one user, one role, one user_role, one user_role (admin) */

            return (app.getHttpServer())
                .delete(`/user_roles/${id}`)
                .expect(res => res.statusCode = 403);
        });
    });

    describe('[ MULTI test ]', () => {
        it ('[ POSTs an user_role, removes user, checks again (should be 404) ]', () => {
            const user_role = { userId: user_id, roleId: role_id };
            let id;
            /* DB_FEED: one user, one room */
            app.getHttpServer()
                .post('/user_role/')
                .data(user_role)
                .expect((res) => {
                    res.statusCode = 201;
                    res.body.containsEql(user_role);

                    id = res.body['id'];
                });
            app.getHttpServer()
                .delete(`/user/${user_id}`)
                .expect(res => res.statusCode = 204);
            return (app.getHttpServer())
                .get(`/user_role/${id}`)
                .expect(res => res.statusCode = 404);
        });
        it ('[ POSTs an user_role, removes role, checks again (should be 404) ]', () => {
            const user_role = { userId: user_id, roleId: role_id };
            let id;
            /* DB_FEED: one user, one room */
            app.getHttpServer()
                .post('/user_role/')
                .data(user_role)
                .expect((res) => {
                    res.statusCode = 201;
                    res.body.containsEql(user_role);

                    id = res.body['id'];
                });
            app.getHttpServer()
                .delete(`/roles/${role_id}`)
                .expect(res => res.statusCode = 204);
            return (app.getHttpServer())
                .get(`/user_role/${id}`)
                .expect(res => res.statusCode = 404);
        });
    });
});