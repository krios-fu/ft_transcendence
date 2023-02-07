import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../src/auth/auth.module";
import * as request from 'supertest';
import { RoomRolesModule } from "../src/room_roles/room_roles.module";
import { Repository } from "typeorm";
import { UserRepository } from "src/user/repositories/user.repository";
import { RoomRepository } from "src/room/repository/room.repository";
import { RoomRolesRepository } from "src/room_roles/repository/room_roles.repository";
import { UserRolesRepository } from "src/user_roles/repository/user_roles.repository";
import { UserEntity } from "src/user/entities/user.entity";
import { RoomEntity } from "src/room/entity/room.entity";
import { RoomRolesEntity } from "src/room_roles/entity/room_roles.entity";
import { UserRolesEntity } from "src/user_roles/entity/user_roles.entity";
import { RolesRepository } from "src/roles/repository/roles.repository";
import { RolesEntity } from "src/roles/entity/roles.entity";

const rooms = ['testingRoom_1', 'testingRoom_2', 'testingRoom_3'];
const users = ['testingUser_1', 'testingUser_2', 'testingUser_3'];
const roles = ['private', 'official'];
enum roles_idx { RI_PRIVATE, RI_OFFICIAL };

const rooms_id = [1,2,3];
const users_id = [1,2,3,4];
const roles_id = [1,2];

const BAD_ROOM_ID = 27;
const BAD_ROLE_ID = 27;
const BAD_ROOM_ROLE_ID = 27;

const MY_USER_ID = 1;
const MY_ROOM_ID = 1;

export const createRoomRoleQuery = queryParams => queryParams.map(
        qp => `INSERT INTO room_roles (roomId,roleId,password) VALUES  (${qp.roomId},${qp.roleId},null);`
    ).reduce(qTotal, q => qTotal + q, '');

describe('/room_roles (e2e)', () => {
    let app: INestApplication;
    let authToken: string = "";
    let userCreds = {
        'username': 'testUser',
        'firstName': 'firstName',
        'lastName': 'lastName',
        'profileUrl': '(nil)',
        'email': '(nil)',
        'photoUrl': '(nil)'
    }

    let userRep: UserRepository;
    let roomRep: RoomRepository;
    let rolesRep: RolesRepository;
    let roomRolesRep: RoomRolesRepository;
    let userRolesRep: UserRolesRepository;

    beforeAll(async () => {
        const testModule: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: 5432,
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWD,
                    database: process.env.DB_TEST_NAME,
                    autoLoadEntities: true,
                    synchronize: true,
                    dropSchema: true
                }),
                AuthModule,
                RoomRolesModule,
            ],
        }).compile()
        app = testModule.createNestApplication();
        await app.init()

        const res = await request(app.getHttpServer())
            .post('/auth/generate')
            .send({ 
                'userProfile': userCreds, 
                'app_id': process.env.FORTYTWO_APP_ID, 
                'app_secret': process.env.FORTYTWO_APP_SECRET
            });
        authToken = res.body.authToken;
        userRep = testModule.get<Repository<UserEntity>>('UserRepository');
        roomRep = testModule.get<Repository<RoomEntity>>('RoomRepository');
        rolesRep = testModule.get<Repository<RolesEntity>>('RolesRepository');
        roomRolesRep = testModule.get<Repository<RoomRolesEntity>>('RoomRolesRepository');
        userRolesRep = testModule.get<Repository<UserRolesEntity>>('UserRolesRepository');

        /* USERS & ROOM db seeding */
        for (let i = 0; i < users.length; i++) {
            await userRep.query(`INSERT INTO user (username,firstName,lastName,profileUrl,email,photoUrl) \
                VALUES (${users[i]},${users[i]}Fn,${users[i]}Ln,${users[i]}Pu,${users[i]}e,${users[i]}Pu);`);
            await roomRep.query( `INSERT INTO room (roomName,ownerId,photoUrl) \
                VALUES (${rooms[i]},${i},${rooms[i]}Pu);` );
        }
        rolesRep.query('INSERT INTO roles (role) \
            VALUES (')
    });

    afterAll(async () => {
        console.log('you\'re my wonderwaaaaaall');
        await userRep.query('DELETE FROM user;');
        await roomRep.query('DELETE FROM room;');
        await app.close();
    });

    beforeEach(async () => {
        /* ?? */
    })

    afterEach(async () => {
        roomRolesRep.query('DELETE FROM room_roles;');
    })

    describe('[ GET /room_roles ]', () => {
        it ('[ Should return an empty list (no room_roles are posted) ]', async () => {
            return request(app.getHttpServer())
                .get('/room_roles')
                .expect(200)
                .expect((res) => {
                    res.body.length = 0;
                    console.log(res.body);
                });
        });
        
        it ('[ Should return a list of one element (db seeded with one room_role) ]', async () => {
            const room_roles = { roomId: rooms_id[0], roleId: roles_id[0], password: null };
            await roomRolesRep.query(genRoomRolesQuery(room_roles));

            return request(app.getHttpServer())
                .get('/room_roles')
                .expect(200)
                .expect((res) => {
                    res.body.length = 1;
                    res.body[0].roomName = 'testRoom';
                });
        });

        it('[ Should return a list of three elements (db seeded with three room_roles) ]', async () => {
            const room_roles = [
                {roomId:1, roleId:1, password:null},
                {roomId:2, roleId:1, password:null},
                {roomId:3, roleId:1, password:null}
            ];

            //const query = room_roles.map(
            //    rr => `INSERT INTO room_roles (roomId,ownerId,password) \
            //        VALUES (${rr.roomId},${rr.roleId},${rr.password});`
            //).reduce((q_sum,q) => q += q_sum, "");

            //console.log(`[DEBUG] query result: ${query}`);

            await roomRolesRep.query(genRoomRolesQuery(room_roles));
            return request(app.getHttpServer())
                .get('/room_roles')
                .expect(200)
                .expect((res) => {
                    res.body.length = 3;
                    res.body.should.containEql(room_roles);
                });
        });
    });

    describe('[ GET /room_roles/:id ]', () => { 
        it ('[ Should return a 404 (searching a non existent room_role) ]', async () => {
            return request(app.getHttpServer())
                .get('/room_roles/1')
                .expect(404);
        });

        it ('[ Should return a room_role (searching an existing room_role ]', async () => {
            await roomRolesRep.query(queryBuilder({
                roomId: rooms_id[0],
                roleId: roles_id[0],
                password: null
                })
            );

            return request(app.getHttpServer())
                .get('/room_roles')
                .expect(200)
                .expect(res => res.body.roomName = 'testRoom');
        });
    });

    describe('[ GET /room_roles/rooms/:id', () => { 
        it ('[ Should return a 404 (searching for a non existing room) ]', async () => {
            return request(app.getHttpServer())
                .get(`/room_roles/rooms/${BAD_ROOM_ID}`)
                .expect(404);
        });

        it ('[ Should return a 200 and an empty list (room with no roles) ]', async () => {
            return request(app.getHttpServer)
                .get('/room_roles/rooms/1')
                .expect((res) => {
                    res.statusCode = 200;
                    res.body.length = 0;
                });
        });

        it ('[ Should return a list of one role ]', async () => {
            const room_roles = { roomId:1,roleId:1,password:null};
            await roomRolesRep.query(genRoomRolesQuery(room_roles));

            return request(app.getHttpServer())
                .get('/room_roles/rooms/1')
                .expect((res) => {
                    res.statusCode = 200;
                    res.body.should.containEql([ room_roles ]);
                });
        });

        it ('[ Should return a list of two roles ]', async () => {
            const room_roles = [ 
                {roomId:1,roleId:RI_PRIVATE,password:null},
                {roomId:1,roleId:RI_OFFICIAL,password:null}
            ];

            await roomRolesRep.query(genRoomRolesQuery(room_roles));
            return request(app.getHttpServer())
            .get('/room_roles/rooms/1')
            .expect((res) => {
                res.statusCode = 200;
                res.body.should.containEql(room_roles);
            });
        });
    });

    describe('[ POST /room_roles ]', () => {
        it ('[ Post with a non existing room ]', () => {
            return(app.getHttpServer())
                .post('/room_roles')
                .send({roomId: BAD_ROOM_ID, roleId: roles_id[0]})
                .expect(res => res.statusCode = 400);
        })

        it ('[ Post with a non existing role ]', () => {
            return (app.getHttpServer())
                .post('/room_roles')
                .send({roomId: rooms_id[0], roleId: BAD_ROLE_ID})
                .expect(res => res.statusCode = 400);
        });

        it ('[ Post an "official" role while not being an admin ]', () => {
           return (app.getHttpServer())
               .post('/room_roles')
               .send({roomId: rooms_id[0], roleId: roles_id[RI_OFFICIAL]})
               .expect(res => res.statusCode = 403);
        });

        it ('[ Post a "private" role while not being an owner ]', () => {
            return (app.getHttpServer())
                .post('/room_roles')
                .send({roomId: rooms_id[0], roleId: roles_id[RI_PRIVATE]})
                .expect(res => res.statusCode = 403);
        });

        it ('[ Post an "official" role while admin ]', () => {
            const user_roles
            userRolesRep.query(`INSERT INTO user_roles (userId,roleId) \
            VALUES (${MY_USER_ID},${roles_id[RI_OFFICIAL]})`);
            return (app.getHttpServer())
                .post('/room_roles')
                .send({roomId: rooms_id[0], roleId: })
        });

        it ('[ Post a "private" role while being owner ]', () => {});
    });

    describe('[ DEL /room_roles/:id ]', () => { 
        it ('[ Delete a non-existing role in room ]', () => {
            return (app.getHttpServer())
                .delete(`/room_roles/${BAD_ROOM_ROLE_ID}`)
                .expect(res => res.statusCode = 404);
        });

        it ('[ Delete an official role while not being an admin ]', () => {
            await roomRolesRep.query(genRoomRolesQuery({
                roomId: rooms_id[0],
                roleId: RI_OFFICIAL,
                password: null
            }));
            return (app.getHttpServer())
                .delete(`/room_roles/${rooms_id[0]}`)
                .expect(res => res.statusCode = 403);
        });

        it ('[ Delete an official role while being an admin ]', () => { 
            const user_role = { userId: MY_USER_ID, roleId: RI_OFFICIAL };

            await roomRolesRep.query(genRoomRolesQuery({
                roomId: rooms_id[0],
                roleId: RI_OFFICIAL,
                password: null
            }));
            await userRolesRep.query(genUserRolesQuery(user_roles));
            return (app.getHttpServer())
                .delete(`/room_roles/${BAD_ROOM_ROLE_ID}`)
                .expect(res => res.statusCode = 204);
        });

        it ('[ Delete a private role while not being an owner ]', () => { 
            const NOT_MY_ROOM_ID = rooms_id[1];

            return (app.getHttpServer())
                .delete(`/room_roles/${NOT_MY_ROOM_ID}`)
                .expect(res => res.statusCode = 403);
        });

        it ('[ Delete a private role while being an owner ]', () => { 
            return (app.getHttpServer())    
                .delete(`/room_roles/${MY_ROOM_ID}`)
                .expect(res => res.statusCode = 204);
        });

    });

    // update payload { oldPassword: string, newPassword: string }
    describe('[ PUT /room_roles/rooms/:id/update ]', () => {
        it ('[ Change password with wrong creds. being owner ]', () => { 
            const pwdCreds = { oldPassword: '1234', newPassword: 'badbadbad!'};

            await roomRolesRep.query({
                roomId: rooms_id[0],
                roleId: RI_PRIVATE,
                password: pwdCreds.oldPassword,
            });
            return (app.getHttpServer())
                .put(`/room_roles/`) // ...
        });

        it ('[ Change password with right creds. being owner ]', () => { 

        });

        it ('[ Change password with wrong creds. not being owner ]', ( ) => { 

        });

        it ('[ Change password with right creds. bot being owner ]', ( ) => { 

        });

        it ('[ Change password of a public room ]', ( ) => { 

        });

        it ('[ Change password of a non-existent room ]', ( ) => { 

        });
    });

    describe('[ PUT /room_roles/:id ]', () => { 
        it ('[  ]')
    });
});
