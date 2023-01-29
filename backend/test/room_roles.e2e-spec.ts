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
        for (var i = 0; i < users.length; i++) {
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
                    res.body.length === 0;
                    console.log(res.body);
                });
        });
        
        it ('[ Should return a list of one element (db seeded with one room_role) ]', async () => {
            await roomRolesRep.query('INSERT INTO room_roles (room_id,role_id) \
                VALUES ()');

            return request(app.getHttpServer())
                .get('/room_roles')
                .expect(200)
                .expect((res) => {
                    res.body.length === 1;
                    res.body[0].roomName === 'testRoom';
                });
        });

        it('[ Should return a list of three elements (db seeded with three room_roles) ]', async () => {
            await queryRunner.query(
                'INSERT INTO room (roomName,ownerId,photoUrl) \
                VALUES ("testRoom", 1, "null"); \
                INSERT INTO room (roomName,ownerId,photoUrl) \
                VALUES ("testRoom_2", 1, "null"); \
                INSERT INTO room (roomName,ownerId,photoUrl) \
                VALUES ("testRoom_3", 1, "null");'
            );

            return request(app.getHttpServer())
                .get('/room_roles')
                .expect(200)
                .expect((res) => {
                    res.body.length === 3;
                    res.body[2].roomName === 'testRoom_3';
                });
        });
    });

    describe('[ GET /room_roles/:id ]', () => { 
        it ('[ Should return a 404 (searching a non existent room_role ]', async () => {
            return request(app.getHttpServer())
                .get('/room_roles/1')
                .expect(404);
        });

        it ('[ Should return a room_role (searching an existing room_role ]', async () => {
            await queryRunner.query(
                'INSERT INTO room (roomName,ownerId,photoUrl) \
                VALUES ("testRoom", 1, "null");'
            );

            return request(app.getHttpServer())
                .get('/room_roles')
                .expect(200)
                .expect((res) => {
                    res.body.roomName === 'testRoom';
                });
        });
    });

    describe('[ GET /room_roles/rooms/:id', () => { 
        it ('[ Should return a 404 (searching for a non existing room) ]', async () => {

        });


    });

    //describe('[ POST /room_roles ]', () => { });
    //describe('[ DEL /room_roles/:id ]', () => { });
    //describe('[ PUT /room_roles/:id ]', () => { });
});
