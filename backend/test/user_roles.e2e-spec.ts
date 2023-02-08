import {INestApplication} from "@nestjs/common";
import {getCredentials} from "./utils/test.utils";
import {UserRolesRepository} from "../src/user_roles/repository/user_roles.repository";

export const genUserRolesQuery = queryParams => queryParams.map(
        qp, `INSERT INTO user_roles (userId, roomId) VALUES (${qp.userId},${qp.roleId});`
    ).reduce((qTotal, q) => qTotal + q, '');

let authToken: string = '';
let app: INestApplication;
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
            UserRolesModule,
        ],
    }).compile()
    app = testModule.createNestApplication();
    await app.init()
    authToken = await getCredentials();

    userRolesRep = testModule.get<UserRolesRepository>('UserRolesRepository');
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

            await userRolesRep.query(genUserRolesQuery(user_roles));
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
        it ('[ Splaceholder ]', () => {

        } );

        it ('[ Splaceholder ]', () => {

        } );
        // get 404
        // get valid
    });

    describe('[ GET /user_roles/users/:user_id ]', () => {
        it ('[ Splaceholder ]', () => {

        } );

        it ('[ Splaceholder ]', () => {

        } );

        it ('[ Splaceholder ]', () => {

        } );

        it ('[ Splaceholder ]', () => {

        } );
        // get non existent user
        // get user with no role
        // get user with role
        // get user with various roles
    });

    describe('[ GET /user_roles/roles/:role_id ]', () => {
        // get non existent role
        // get user with no role
        // get role with user
        // get role from various users
        it ('[ Splaceholder ]', () => {

        });

        it ('[ Splaceholder ]', () => {

        });

        it ('[ Splaceholder ]', () => {

        });

        it ('[ Splaceholder ]', () => {

        });
    });

    describe('[ POST /user_roles ]', () => {
        // post with no user
        // post with no role
        // post ok
        // post not being admin
        it ('[ Splaceholder ]', () => {

        });

        it ('[ Splaceholder ]', () => {

        });

        it ('[ Splaceholder ]', () => {

        });

        it ('[ Splaceholder ]', () => {

        });

    });

    describe('[ DEL /user_roles/:id ]', () => {
        // delete 404
        // delete ok
        // delete not being admin
        it ('[ Splaceholder ]', () => {} );
        it ('[ Splaceholder ]', () => {} );
        it ('[ Splaceholder ]', () => {} );
    });

});