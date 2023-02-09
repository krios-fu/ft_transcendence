import {Delete, Get, INestApplication, Post, Put} from "@nestjs/common";
import {RoomRepository} from "../src/room/repository/room.repository";
import {UserRoomRepository} from "../src/user_room/repository/user_room.repository";

let app: INestApplication;
let authToken: string = '';
let roomRepository: RoomRepository;
let userRoomsRepository: UserRoomRepository;

beforeAll(() => {

});

describe('/room (e2e)', () => {
    describe('[ GET /room ]', () => {
        // get no room
        // get multiple rooms
    });

    describe('[ GET /room/:room_id ]', () => {
        // get no room
        // get a room
    });

    describe('[ GET /room/:room_id/owner ]', () => {
        // get owner of no room
        // get owner of room
    });

    describe('[ PUT /room/:room_id/owner/:owner_id ]', () => {
        it('[ Change owner of no room ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

        it('[ Change no owner of room ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

        it('[ Change owner of room, no permissions ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

        it('[ Change owner to same owner ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

        it('[ Change owner of room, owner ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

        it('[ Change owner of room, admin ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

        it('[ Change owner of room, remove user ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

        it('[ Change owner of room, owner exits ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

        it('[ Change owner of room, user not in room ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

        it('[ Change owner of room, user is banned in room ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

        it('[ Change owner of room, user is banned from app ]', () => {
            return (app.getHttpServer())
                .put( `/room/${room_id}/owner/${owner_id}`)
                .data()
                .expect()
        });

    });

    describe('[ POST /room ]', () => {
        // create room while banned
        // create room
    });

    describe('[ DEL /room/:room_id ]', () => {
        // remove no room
        // remove room not being owner or admin
        // remove room being admin
        // remove room being owner, check user_room removal
    });

    describe('[ POST /room/:room_id/avatar ]', () => {
        // post avatar to no room
        // post avatar, not owner or admin
        // post avatar, no file
        // post avatar, bad file
        // post avatar, owner
    });

    describe('[ DEL /room/:room_id/avatar ]', () => {
        // delete avatar, no room
        // delete avatar, no avatar
        // delete avatar, not owner or admin
        // delete avatar
    });
});