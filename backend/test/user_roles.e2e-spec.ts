export const genUserRolesQuery = queryParams => queryParams.map(
        qp, `INSERT INTO user_roles (userId, roomId) VALUES (${qp.userId},${qp.roleId});`
    ).reduce((qTotal, q) => qTotal + q, '');

let authToken = '';

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

    
    authToken = getCredentials();
}

describe('/user_roles (e2e)', () => {
    it ('[ placeholder ]', () => {
        expect(1).toBe(1);
    });

    describe('[ GET /user_roles ]', () => {

    });

    describe('[ GET /user_roles/:id ]', () => {

    });

    describe('[ GET /user_roles/users/:user_id ]', () => {

    });

    describe('[ GET /user_roles/roles/:role_id ]', () => {

    });

    describe('[ POST /user_roles ]', () => {

    });

    describe('[ DEL /user_roles/:id ]', () => {

    });

});