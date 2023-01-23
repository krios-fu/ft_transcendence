import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";
import * as request from 'supertest';

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

    beforeEach(async () => {

        const testModule: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: 5432,
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWD,
                    database: process.env.DB_NAME,
                    entities: ["dist/**/*.entity{.ts,.js}"],
                    synchronize: true,
                }),
                UserModule,
                AuthModule
            ],
        }).compile()

        app = testModule.createNestApplication();
        await app.init()
        const res = await request(app.getHttpServer())
            .post('/auth/generate')
            .send({ 
                'userProfile': userCreds, 
                'api_token': process.env.FORTYTWO_APP_ID, 
                'api_secret': process.env.FORTYTWO_APP_SECRET
            })
        authToken = res.body.authToken;
    });

    it ('[ simply an auth. token test ]', () => {
        return request(app.getHttpServer())
            .get('/users')
            .expect(200)
    })
});