
describe('/user (e2e)', () => {
    describe ('[ GET /user ]', () => {
        // get no users
        // get list of users
    });

    describe ('[ GET /user/me ]', () => {
        // get me
    });

    describe ('[ GET /user/:id ]', () => {
        // get no user
        // get user
        // get user blocked
        // get user blocking
    });

    describe ('[ GET /user/:username ]', () => {
        // get no user
        // get user
        // get user blocked
        // get user blocking
    });

    describe ('[ POST /user ]', () => {
        // create user not being admin
        // create user, malformed dtos
        // create user
    });

    describe ('[ PATCH /user/:id ]', () => {
        // edit user not being me or admin
        // edit user being admin
        // edit my user
    });

    describe ('[ PATCH /user/me ]', () => {
        // edit my user, update dto
    });

    describe ('[ PATCH /user/me/settings ]', () => {
        // edit my user, settings dto
    });

    describe ('[ POST /user/me/avatar ]', () => {
        // upload avatar, bad file
        // upload avatar
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
        // delete user, not admin or me
        // delete user, admin
        // delete user, me
        // delete user, no user
        // delete banned user, check ban
        // delete user with roles, check user_roles
        // delete user with roles in room, check roles in room
        // delete user in rooms, check user_rooms
        // delete user with achievements, check user_achievements
    });

    describe('[ GET /user/me/chats ]', () => {
        // get user chats, no chats
        // get user chats
    });

    describe('[ GET /user/me/chat/:nick_friend ]', () => {
        // get user friend, no friend as user
        // get user friend, user but no friend
        // get user friend
    });

    describe ('[ POST /user/me/chat ]', () => {

    });

    describe ('[ GET /user/me/friends ]', () => {

    });

    describe ('[ GET /user/me/friends/as_pendding ]', () => {

    });

    describe ('[ GET  /user/me/friends/:friend_id ]', () => {

    });

    describe ('[ Post /user/me/friends ]', () => {

    });

    describe ('[ PATCH /user/:user_id/friends/:friend_id/accept ]', () => {

    });

    describe ('[ PATCH /user/:user_id/friends/:friend_id/refuse ]', () => {

    });

    describe ('[ GET /user/me/blocked ]', () => {

    });

    describe ('[ POST /user/me/blocked ]', () => {

    });

    describe ('[ DEL /user/me/blocked/:id ]', () => {

    });

});