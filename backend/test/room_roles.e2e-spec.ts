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
import {genRoomRolesQuery, genUserRolesQuery, getCredentials, moduleConfig} from "./utils/test.utils";
import {UserModule} from "../src/user/user.module";
import {ChatModule} from "../src/chat/chat.module";
import {MulterModule} from "@nestjs/platform-express";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";
import {RolesModule} from "../src/roles/roles.module";
import {RoomModule} from "../src/room/room.module";
import {UserRoomModule} from "../src/user_room/user_room.module";
import {UserRolesModule} from "../src/user_roles/user_roles.module";
import {UserRoomRolesModule} from "../src/user_room_roles/user_room_roles.module";
import {BanModule} from "../src/ban/ban.module";
import {AchievementsModule} from "../src/achievements/achievements.module";
import {AchievementsUserModule} from "../src/achievements_user/achievements_user.module";
import {MatchModule} from "../src/match/match.module";
import {WinnerModule} from "../src/match/winner/winner.module";
import {LoserModule} from "../src/match/loser/loser.module";
import {GameModule} from "../src/game/game.module";
import {UserService} from "../src/user/services/user.service";

const rooms = ['testingRoom_1', 'testingRoom_2', 'testingRoom_3'];
const users = ['testingUser_1', 'testingUser_2', 'testingUser_3'];
enum roles { PRIVATE, OFFICIAL };

const rooms_id = [1,2,3];
const users_id = [1,2,3,4];
const roles_id = [1,2];

const BAD_ROOM_ID = 27;
const BAD_ROLE_ID = 27;
const BAD_ROOM_ROLE_ID = 27;

const MY_USER_ID = 1;
const MY_ROOM_ID = 1;

describe('/room_roles (e2e)', () => {
    let app: INestApplication;
    let moduleRef: TestingModule;
    let authToken: string = "";

    let userRepository: UserRepository;
    let roomRepository: RoomRepository;
    let rolesRepository: RolesRepository;
    let roomRolesRepository: RoomRolesRepository;
    let userRolesRepository: UserRolesRepository;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(moduleConfig),
                UserModule,
                AuthModule,
                ChatModule,
                MulterModule.register({
                    dest: './public',
                }),
                ServeStaticModule.forRoot({
                    rootPath: join(__dirname, '..', 'public'),
                }),
                RolesModule,
                RoomModule,
                UserRoomModule,
                UserRolesModule,
                UserRoomRolesModule,
                BanModule,
                RoomRolesModule,
                AchievementsModule,
                AchievementsUserModule,
                MatchModule,
                WinnerModule,
                LoserModule,
                GameModule
            ],
        }).compile()
        app = moduleRef.createNestApplication();
        await app.init()

        //const res = await request(app.getHttpServer())
        //    .post('/auth/generate')
        //    .send({
        //        'userProfile': userCreds,
        //        'app_id': process.env.FORTYTWO_APP_ID,
        //        'app_secret': process.env.FORTYTWO_APP_SECRET
        //    });
        //authToken = res.body.authToken;
        let userService: UserService = moduleRef.get('UserService');
        userService.tmp();

        authToken = await getCredentials(app);

        console.log(`Token: ${authToken}`);
        roomRolesRepository = moduleRef.get<RoomRolesRepository>('RoomRolesRepository', { strict: false });
        userRepository = moduleRef.get<UserRepository>('UserRepository');
        roomRepository = moduleRef.get<RoomRepository>('RoomRepository');
        rolesRepository = moduleRef.get<RolesRepository>('RolesRepository');
        userRolesRepository = moduleRef.get<UserRolesRepository>('UserRolesRepository');



        /* USERS & ROOM db seeding */
        for (let i = 0; i < users.length; i++) {
            await userRepository.query(`INSERT INTO user (username,firstName,lastName,profileUrl,email,photoUrl) \
                VALUES (${users[i]},${users[i]}Fn,${users[i]}Ln,${users[i]}Pu,${users[i]}e,${users[i]}Pu);`);
            await roomRepository.query( `INSERT INTO room (roomName,ownerId,photoUrl) \
                VALUES (${rooms[i]},${i},${rooms[i]}Pu);` );
        }
        //await rolesRepository.query('INSERT INTO roles (role) \
        //    VALUES (')
    });

    afterAll(async () => {
        console.log('you\'re my wonderwaaaaaall');
        await userRepository.clear();
        await roomRepository.clear();
        await rolesRepository.clear();
        await app.close();
    });

    beforeEach(async () => {
        /* ?? */
    })

    afterEach(async () => {
        await roomRolesRepository.clear()
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
            await roomRolesRepository.query(genRoomRolesQuery(room_roles));

            return request(app.getHttpServer())
                .get('/room_roles')
                .expect(200)
                .expect((res) => {
                    res.body.length = 1;
                    res.body.should.containEql(room_roles);
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

            await roomRolesRepository.query(genRoomRolesQuery(room_roles));
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
            await roomRolesRepository.query(genRoomRolesQuery({
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
            await roomRolesRepository.query(genRoomRolesQuery(room_roles));

            return request(app.getHttpServer())
                .get('/room_roles/rooms/1')
                .expect((res) => {
                    res.statusCode = 200;
                    res.body.should.containEql([ room_roles ]);
                });
        });

        it ('[ Should return a list of two roles ]', async () => {
            const room_roles = [ 
                {roomId:1,roleId:roles.PRIVATE,password:null},
                {roomId:1,roleId:roles.OFFICIAL,password:null}
            ];

            await roomRolesRepository.query(genRoomRolesQuery(room_roles));
            return request(app.getHttpServer())
            .get('/room_roles/rooms/1')
            .expect((res) => {
                res.statusCode = 200;
                res.body.should.containEql(room_roles);
            });
        });
    });

    describe('[ POST /room_roles ]', () => {
        it ('[ Post with a non existing room ]', async () => {
            return(app.getHttpServer())
                .post('/room_roles')
                .send({roomId: BAD_ROOM_ID, roleId: roles_id[0]})
                .expect(res => res.statusCode = 400);
        })

        it ('[ Post with a non existing role ]', async () => {
            return (app.getHttpServer())
                .post('/room_roles')
                .send({roomId: rooms_id[0], roleId: BAD_ROLE_ID})
                .expect(res => res.statusCode = 400);
        });

        it ('[ Post an "official" role while not being an admin ]', async () => {
           return (app.getHttpServer())
               .post('/room_roles')
               .send({roomId: rooms_id[0], roleId: roles_id[roles.OFFICIAL]})
               .expect(res => res.statusCode = 403);
        });

        it ('[ Post a "private" role while not being an owner ]', async () => {
            return (app.getHttpServer())
                .post('/room_roles')
                .send({roomId: rooms_id[0], roleId: roles_id[roles.PRIVATE]})
                .expect(res => res.statusCode = 403);
        });

        it ('[ Post an "official" role while admin ]', async () => {
            const user_roles = {};
            userRolesRepository.query(`INSERT INTO user_roles (userId,roleId) \
            VALUES (${MY_USER_ID},${roles_id[roles.OFFICIAL]})`);
            return (app.getHttpServer())
                .post('/room_roles')
                .send({roomId: rooms_id[0], roleId: roles.OFFICIAL})
        });

        it ('[ Post a "private" role while being owner ]', async () => {});
    });

    describe('[ DEL /room_roles/:id ]', () => { 
        it ('[ Delete a non-existing role in room ]', async () => {
            return (app.getHttpServer())
                .delete(`/room_roles/${BAD_ROOM_ROLE_ID}`)
                .expect(res => res.statusCode = 404);
        });

        it ('[ Delete an official role while not being an admin ]', async () => {
            await roomRolesRepository.query(await genRoomRolesQuery({
                roomId: rooms_id[0],
                roleId: roles.OFFICIAL,
                password: null
            }));
            return (app.getHttpServer())
                .delete(`/room_roles/${rooms_id[0]}`)
                .expect(res => res.statusCode = 403);
        });

        it ('[ Delete an official role while being an admin ]', async () => {
            const user_role = { userId: MY_USER_ID, roleId: roles.OFFICIAL };

            await roomRolesRepository.query(genRoomRolesQuery({
                roomId: rooms_id[0],
                roleId: roles.OFFICIAL,
                password: null
            }));
            await userRolesRepository.query(genUserRolesQuery(user_role));
            return (app.getHttpServer())
                .delete(`/room_roles/${BAD_ROOM_ROLE_ID}`)
                .expect(res => res.statusCode = 204);
        });

        it ('[ Delete a private role while not being an owner ]', async () => {
            const NOT_MY_ROOM_ID = rooms_id[1];

            return (app.getHttpServer())
                .delete(`/room_roles/${NOT_MY_ROOM_ID}`)
                .expect(res => res.statusCode = 403);
        });

        it ('[ Delete a private role while being an owner ]', async () => {
            return (app.getHttpServer())    
                .delete(`/room_roles/${MY_ROOM_ID}`)
                .expect(res => res.statusCode = 204);
        });

    });

    // update payload { oldPassword: string, newPassword: string }
    describe('[ PUT /room_roles/rooms/:id/update ]', () => {
        const pwdCreds = { oldPassword: '1234', newPassword: 'badvadvad!'};

        it ('[ Change password with wrong creds. being owner ]', async () => {
            const room_id = rooms_id[0]

            await roomRolesRepository.query(genRoomRolesQuery({
                    roomId: room_id,
                    roleId: roles.PRIVATE,
                    password: '12345',
                })
            );
            return (app.getHttpServer())
                .put(`/room_roles/room/${room_id}/update`)
                .send(pwdCreds)
                .expect(res => res.statusCode = 403);
        });

        it ('[ Change password with right creds. being owner ]', async () => {
            const roomId = rooms_id[0];

            await roomRolesRepository.query(genRoomRolesQuery({
                roomId: roomId,
                roleId: roles.PRIVATE,
                password: pwdCreds.oldPassword,
                })
            );
            return (app.getHttpServer())
                .put(`/room_roles/room/${roomId}/update`)
                .send(pwdCreds)
                .expect(res => res.statusCode = 201);
        });

        it ('[ Change password with wrong creds. not being owner ]', async () => {
            const roomId = rooms_id[1];

            await roomRolesRepository.query(genRoomRolesQuery({
                roomId: roomId,
                roleId: roles.PRIVATE,
                password: 'bad_pwd'
            }));
            return (app.getHttpServer())
                .put(`/room_roles/room/${roomId}/update`)
                .send(pwdCreds)
                .expect(res => res.statusCode = 403);
        });

        it ('[ Change password with right creds. bot being owner ]', async () => {
            const roomId = rooms_id[1];

            await roomRolesRepository.query(genRoomRolesQuery({
                roomId: roomId,
                roleId: roles.PRIVATE,
                password: pwdCreds.oldPassword,
            }));

            return (app.getHttpServer())
                .put(`/room_roles/room/${roomId}/update`)
                .send(pwdCreds)
                .expect(res => res.statusCode = 403);
        });

        it ('[ Change password of a public room ]', async () => {
            const roomId = rooms_id[0];

            return (app.getHttpServer())
                .put(`/room_roles/room/${roomId}/update`)
                .send(pwdCreds)
                .expect(res => res.statusCode = 400);
        });

        it ('[ Change password of a non-existent room ]', async () => {
            return (app.getHttpServer())
                .put(`/room_roles/room/${BAD_ROOM_ID}/update`)
                .send(pwdCreds)
                .expect(res => res.statusCode = 404);
        });
    });
});
