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
        it('[ Get no room ]', () => {
            return (app.getHttpServer())
                .get('/room')
                .expect(res => res.statusCode = 8989);
        });

        it('[ Get multiple rooms ]', () => {
            return (app.getHttpServer())
                .get('/room')
                .expect(res => res.statusCode = 8989);
        });
    });

    describe('[ GET /room/:room_id ]', () => {
        it('[ Get non-existent room ]', () => {
            return (app.getHttpServer())
                .get(`/room/${room_id}`)
                .expect(res => res.statusCode = 8989);
        });

        it('[ Get a room ]', () => {
            /* DB_FEED: one room */
            return (app.getHttpServer())
                .get(`/room/${room_id}`)
                .expect(res => res.statusCode = 8989);
        });

    });

    describe('[ GET /room/:room_id/owner ]', () => {
        it('[ Get owner of no room ]', () => {
        return (app.getHttpServer())
            .get()
            .expect(res => res.statusCode = 8989);
        });

        it('[ Get owner of room ]', () => {
        return (app.getHttpServer())
            .get()
            .expect(res => res.statusCode = 8989);
        });

    });

    describe('[ PUT /room/:room_id/owner/:owner_id ]', () => {
        it('[ Change owner of no room ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
        });

        it('[ Change no owner of room ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
        });

        it('[ Change owner of room, no permissions ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
        });

        it('[ Change owner to same owner ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
        });

        it('[ Change owner of room, owner ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
        });

        it('[ Change owner of room, admin ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
        });

        it('[ Change owner of room, remove user ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
        });

        it('[ Change owner of room, owner exits ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
        });

        it('[ change owner of room, user not in room ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
        });

        it('[ change owner of room, user is banned in room ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
        });

        it('[ change owner of room, user is banned from app ]', () => {
            return (app.getHttpServer())
                .put(`/room/${room_id}/owner/${owner_id}`)
                .data(/* data goes here */)
                .expect(res => res.statusCode = 8989);
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
        it('[ create room while banned ]', () => {
            return (app.getHttpServer())
                .post('/room')
                .data()
                .expect();
        });

        it('[ Create a room ]', () => {
            return (app.getHttpServer())
                .post('/room')
                .data()
                .expect();
        });

    });

    describe('[ DEL /room/:room_id ]', () => {
        it('[ remove no room ]', () => {
            return (app.getHttpServer())
                .delete(`/room/${room_id}`)
                .expect(res => res.statusCode = 8989);
        });

        it('[ remove room not being owner or admin ]', () => {
            return (app.getHttpServer())
                .delete(`/room/${room_id}`)
                .expect(res => res.statusCode = 8989);
        });

        it('[ remove room being admin ]', () => {
            return (app.getHttpServer())
                .delete(`/room/${room_id}`)
                .expect(res => res.statusCode = 8989);
        });

        it('[ remove room being owner, check user_room removal ]', () => {
            return (app.getHttpServer())
                .delete(`/room/${room_id}`)
                .expect(res => res.statusCode = 8989);
        });

    });

    describe('[ POST /room/:room_id/avatar ]', () => {
        it('[ post avatar to no room ]', () => {
            return (app.getHttpServer())
                .post(`/room/${room_id}/avatar`)
                .data()
                .expect(res => res.statusCode = 8989);
        });

        it('[ post avatar, not owner or admin ]', () => {
            return (app.getHttpServer())
                .post(`/room/${room_id}/avatar`)
                .data()
                .expect(res => res.statusCode = 8989);
        });

        it('[ post avatar, no file ]', () => {
            return (app.getHttpServer())
                .post(`/room/${room_id}/avatar`)
                .data()
                .expect(res => res.statusCode = 8989);
        });

        it('[ post avatar, bad file ]', () => {
            return (app.getHttpServer())
                .post(`/room/${room_id}/avatar`)
                .data()
                .expect(res => res.statusCode = 8989);
        });

        it('[ post avatar, owner ]', () => {
            return (app.getHttpServer())
                .post(`/room/${room_id}/avatar`)
                .data()
                .expect(res => res.statusCode = 8989);
        });
    });

    describe('[ DEL /room/:room_id/avatar ]', () => {
        it('[ delete avatar, no room ]', () => {
            return (app.getHttpServer())
                .delete(`/room/${room_id}/avatar`)
                .expect(res => res.statusCode = 8989);
        });

        it('[ delete avatar, no avatar ]', () => {
            return (app.getHttpServer())
                .delete(`/room/${room_id}/avatar`)
                .expect(res => res.statusCode = 8989);
        });

        it('[ delete avatar, not owner or admin ]', () => {
            return (app.getHttpServer())
                .delete(`/room/${room_id}/avatar`)
                .expect(res => res.statusCode = 8989);
        });

        it('[ delete avatar ]', () => {
            return (app.getHttpServer())
                .delete(`/room/${room_id}/avatar`)
                .expect(res => res.statusCode = 8989);
        });
    });
});