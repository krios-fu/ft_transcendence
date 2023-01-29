import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../../src/auth/auth.module";
import * as request from 'supertest';
import { RoomRolesModule } from "../../src/room_roles/room_roles.module";
import { DataSource, QueryRunner } from "typeorm";

describe('/room_roles (e2e)', () => {
    let app: INestApplication;
    let authToken: string = "";
    let dataSrc: DataSource;
    let queryRunner: QueryRunner;
    let userCreds = {
        'username': 'testUser',
        'firstName': 'firstName',
        'lastName': 'lastName',
        'profileUrl': '(nil)',
        'email': '(nil)',
        'photoUrl': '(nil)'
    }

    beforeAll(async () => {
        const testModule: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: 5432,
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWD,
                    database: process.env.DB_NAME,
                    autoLoadEntities: true,
                    synchronize: true,
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
            })
        authToken = res.body.authToken;
        queryRunner = dataSrc.createQueryRunner();
        console.log('victoria total y absoluta');
    });

    afterAll(async () => {
        console.log('you\'re my wonderwaaaaaall');
        await app.close();
    });

    beforeEach(async () => {
        queryRunner.startTransaction();
    })

    afterEach(async () => {
        queryRunner.rollbackTransaction();
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
            await queryRunner.connect();
            await queryRunner.query(
                'INSERT INTO room (roomName,ownerId,photoUrl) \
                VALUES ("testRoom", 1, "null");'
            );

            return request(app.getHttpServer())
                .get('/room_roles')
                .expect(200)
                .expect((res) => {
                    res.body.length === 1;
                    res.body[0].roomName === 'testRoom';
                });
        });

        it('[ Should return a list of three elements (db seeded with three room_roles) ]', async () => {
            await queryRunner.connect();
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
            await queryRunner.connect();
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

    describe('[ POST /room_roles ]', () => { });
    describe('[ DEL /room_roles/:id ]', () => { });
    describe('[ PUT /room_roles/:id ]', () => { });
});
