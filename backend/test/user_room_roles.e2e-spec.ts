import {INestApplication} from "@nestjs/common";
import {getCredentials, moduleConfig} from "./utils/test.utils";
import {Test} from "@nestjs/testing";
export const getUserRoomRolesQuery  = queryParams => queryParams.map(
    qp, `INSERT INTO user_roles (userRoomId, roomId) VALUES (${qp.userRoomId},${qp.roleId});`
).reduce((qTotal, q) => qTotal + q, '');

let app: INestApplication;
let authToken: string = '';

beforeAll(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot(moduleConfig),
            AuthModule,
            UserRoomRolesModule,
        ],
    }).compile()
    app = testModule.createNestApplication();
    await app.init()
    authToken = await getCredentials();
});

describe('/user_room_roles (e2e)', () => {
    describe( '[ GET /user_room_roles/ ] ', () => {

    });

    describe( '[ GET /user_room_roles/:id ] ', () => {

    });

    describe( '[ GET /user_room_roles/rooms/:room_id ] ', () => {

    });

    describe( '[ GET /user_room_roles/rooms/:room_id/roles/:role_id ] ', () => {

    });

    // POST /user_room_roles
    // DEL /user_room_roles/:id
});
