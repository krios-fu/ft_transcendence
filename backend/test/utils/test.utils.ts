import * as request from 'supertest';
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export const getCredentials = async () => {
    const res = await request(app.getHttpServer())
        .post('/auth/generate')
        .send({ 
            'userProfile': userCreds, 
            'app_id': process.env.FORTYTWO_APP_ID, 
            'app_secret': process.env.FORTYTWO_APP_SECRET
        });
    return res.body.authToken;
}

export const moduleConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWD,
    database: process.env.DB_TEST_NAME,
    autoLoadEntities: true,
    synchronize: true,
    dropSchema: true
};