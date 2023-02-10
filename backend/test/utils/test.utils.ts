import * as request from 'supertest';
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

/* ~~ Query builders ~~ */
export const genUserQuery = (queryParams) => {
    return queryParams.map(qp => {
        `INSERT INTO user (username,firstName,lastName,profileUrl,email,photoUrl) \
         VALUES (${qp.username},${qp.firstName},${qp.lastName},${qp.profileUrl},${qp.email},${qp.photoUrl}); `
    }).reduce((qTot, q) => qTot + q, '');
}

const genRoomQuery = (queryParams) => {
    return queryParams.map(qp => {
        `INSERT INTO room (roomName,ownerId,photoUrl) \
         VALUES (${qp.roomName},${qp.ownerId},${qp.photoUrl}); `
    }).reduce((qTot, q) => qTot + q, '');
}
export const genRoomRolesQuery = (queryParams) =>  {
    return queryParams.map(qp => {
        `INSERT INTO room_roles (roomId,roleId,password) \ 
         VALUES  (${qp.roomId},${qp.roleId},null); `
        }).reduce((qTot, q) => qTot + q, '');
}

export const genRoleQuery = roles => {
    return roles.map(role => `INSERT INTO roles (role) VALUES (${role}); ` )
        .reduce((qTot, q) => qTot + q, '');
}

export const genUserRolesQuery = (queryParams) => {
    return queryParams.map(
        qp => `INSERT INTO user_roles (userId, roomId) VALUES (${qp.userId},${qp.roleId});`
    ).reduce((qTot, q) => qTot + q, '');
}

/* ~~                ~~ */

export const getCredentials = async (app) => {
    let userCreds = {
        'username': 'testUser',
        'firstName': 'firstName',
        'lastName': 'lastName',
        'profileUrl': '(nil)',
        'email': '(nil)',
        'photoUrl': '(nil)'
    }
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