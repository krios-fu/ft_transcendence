import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {TypeOrmModule} from "@nestjs/typeorm";
import {moduleConfig} from "./utils/test.utils";
import {UserModule} from "../src/user/user.module";
import {AuthModule} from "../src/auth/auth.module";
import {UserRepository} from "../src/user/repositories/user.repository";

let app: INestApplication;
let authToken: string = '';
let userRepository: UserRepository;
beforeAll(async () => {
    const tModule: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(moduleConfig),
                AuthModule,
                UserModule,
            ],
        }).compile();
    app = tModule.createNestApplication();
    await app.init();
});

describe('/user (e2e)', () => {
    describe ('[ GET /user ]', () => {
        it('[ get no users]', () => {

        });

        it('[ get list of users]', () => {

        });

    });

    describe ('[ GET /user/me ]', () => {
        it('[ get me]', () => {

        });

    });

    describe ('[ GET /user/:id ]', () => {
        it('[ get no user]', () => {

        });

        it('[ get user]', () => {

        });

        it('[ get user blocked]', () => {

        });

        it('[ get user blocking]', () => {

        });

    });

    describe ('[ GET /user/:username ]', () => {
        it('[ Get no user ]', () => {

        });

        it('[ Get user ]', () => {

        });

        it('[ Get user blocked ]', () => {

        });

        it('[ Get user blocking ]', () => {

        });
    });

    describe ('[ POST /user ]', () => {
        it('[ create user not being admin ]', () => {

        });

        it('[ create user, malformed dtos ]', () => {

        });

        it('[ create user ]', () => {

        });

    });

    describe ('[ PATCH /user/:id ]', () => {
        it('[ edit user not being me or admin ]', () => {

        });

        it('[ edit user being admin ]', () => {

        });

        it('[ edit my user ]', () => {

        });

    });

    describe ('[ PATCH /user/me ]', () => {
        it('[ edit my user, update dto ]', () => {

        });

    });

    describe ('[ PATCH /user/me/settings ]', () => {
        it('[ edit my user, settings dto ]', () => {

        });

    });

    describe ('[ POST /user/me/avatar ]', () => {
        it('[ upload avatar, bad file ]', () => {

        });

        it('[ upload avatar ]', () => {

        });

    });

    describe ('[ POST /user/:id/avatar ]', () => {
        // upload avatar, not me or admin
        // upload avatar, me
        // upload avatar, admin
        // upload avatar, no user
        // upload avatar, bad file
    });

    describe('[ DEL /user/me/avatar ]', () => {
        // delete my avatar, default avatar
        // delete my avatar, 42 avatar
        // delete my avatar
    });

    describe('[ DEL /user/:id/avatar ]', () => {
        // delete avatar, no user
        // delete avatar, not me or admin
        // delete avatar
    });

    describe('[ DEL /user/:id ]', () => {
        it('[ delete user, not admin or me ]', () => {

        });

        it('[ Delete user, admin ]', () => {

        });

        it('[ Delete user, me ]', () => {

        });

        it('[ Delete user, no user ]', () => {

        });

        it('[ Delete banned user, check ban ]', () => {

        });

        it('[ Delete user with roles, check user_roles ]', () => {

        });

        it('[ Delete user with roles in room, check roles in room ]', () => {

        });

        it('[ Delete user in rooms, check user_rooms ]', () => {

        });

        it('[ Delete user with achievements, check user_achievements ]', () => {

        });

        it('[ Kill yourself ]', () => {

        });
    });

    describe('[ GET /user/me/chats ]', () => {
        it('[ Get user chats, no chats ]', () => {

        });

        it('[ Get user chats ]', () => {

        });

    });

    describe('[ GET /user/me/chat/:nick_friend ]', () => {
        it('[ Get user friend, no friend as user ]', () => {

        });

        it('[ Get user friend, user but no friend ]', () => {

        });

        it('[ Get user friend ]', () => {

        });

    });

    describe ('[ POST /user/me/chat ]', () => {
        it('[ post chat, no user ]', () => {

        });

        it('[ post chat ]', () => {

        });

    });

    describe ('[ GET /user/me/friends ]', () => {
        it('[ get friends, no friends ]', () => {

        });

        it('[ get friends, many friends ]', () => {

        });
    });

    describe ('[ GET /user/me/friends/as_pending ]', () => {
        it('[ get pending friends, nothing pending ]', () => {

        });

        it('[ get pending friends ]', () => {

        });
    });

    describe ('[ GET  /user/me/friends/:friend_id ]', () => {
        it('[ get one friend, no user ]', () => {

        });

        it('[ get one friend, no friend ]', () => {

        });

        it('[ get one friend ]', () => {

        });
    });

    describe ('[ POST /user/me/friends ]', () => {
        it('[ add new friend, no user ]', () => {

        });

        it('[ add new friend, you are blocked ]', () => {

        });

        it('[ add new friend, you blocked them ]', () => {

        });

        it('[ add new friend, banned user ]', () => {

        });

        it('[ add new friend, already friends ]', () => {

        });

        it('[ add new friend ]', () => {

        });

    });

    describe ('[ PATCH /user/me/friends/:friend_id/accept ]', () => {
        it('[ accept friend, no user ]', () => {

        });

        it('[ accept friend, no friend ]', () => {

        });

        it('[ accept friend, friendship not pending ]', () => {

        });

        it('[ accept friend, friend blocked ]', () => {

        });

        it('[ accept friend, user blocked ]', () => {

        });

        it('[ accept friend, friend banned ]', () => {

        });

        it('[ accept friend ]', () => {

        });

    });

    describe ('[ PATCH /user/me/friends/:friend_id/refuse ]', () => {
        it('[ refuse friend, no user] ', () => {

        });

        it('[ refuse friend, no friend] ', () => {

        });

        it('[ refuse friend, not pending] ', () => {

        });

        it('[ refuse friend, user blocked] ', () => {

        });

        it('[ refuse friend, friend blocked] ', () => {

        });

        it('[ refuse friend, friend banned] ', () => {

        });

        it('[ refuse friend] ', () => {

        });
    });

    describe ('[ GET /user/me/blocked ]', () => {
        it('[ get blocked, no blocked] ', () => {

        });

        it('[ get blocked, many blocked] ', () => {

        });
    });

    describe ('[ POST /user/me/blocked ]', () => {
        it('[ post blocked, no user] ', () => {

        });

        it('[ post blocked] ', () => {

        });

        it('[ post blocked, another state (friend, pending)] ', () => {

        });
    });

    describe ('[ DEL /user/me/blocked/:id ]', () => {
        it('[ delete blocked relation, no relation ]', () => {

        });

        it('[ delete blocked relation ]', () => {

        });
    });
});