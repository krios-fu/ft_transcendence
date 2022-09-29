# ENDPOINTS

## auth

## ban

GET  /ban
GET  /ban/:ban_id
GET  /ban/rooms/:room_id
GET  /ban/users/:user_id
POST /ban
{
    "user_id": uid,
    "room_id": rid,
}
DELETE /ban/:ban_id

## roles

GET  /roles
GET  /roles/:role_id
POST /roles
{
    "role_id": rid,
}
PATCH /roles/:role_id
DELETE /roles/:role_id

## roles_room

GET  /roles_room/:id
GET  /roles_room/rooms/:room_id
GET  /roles_room/rooms/:room_id/roles/:role_id
POST /roles_room
{
    "user_room_id": urid,
    "role_id": rid,
}
DELETE /roles_room/:id

## roles_user

GET  /roles_user/:id
GET  /roles_user/users/:user_id
GET  /roles_user/roles/:role_id
POST /roles_user
{
    "user_id": uid,
    "role_id": rid,
}
DELETE /roles_user/:id

## room

GET  /room
GET  /room/:room_id
GET  /room/:room_id/owner/:owner_id
PUT  /room/:room_id/owner/:owner_id
POST /room
{
    "room_id": ri,
    "owner": o,
    "password"?: pwd,
}
DELETE /room/:room_id

## user

GET  /users/
GET  /users/:id
POST /users/new
{
    "username": user,
    "firstName": fn,
    "lastName": ln,
    "profileUrl": pu,
    "email": mail,
    "photoUrl": url,
}
PATCH  /users/:id
DELETE /users/:id

## friends

GET  /friends
GET  /friends/:id
POST /friends/:id
{ ?? }
PATCH /friends/accept/:id
PATCH /friends/refuse/:id

## users_room

POST /users_room/
{
    "user_id": username,
    "room_id": roomname,
}
GET  /users_room/
GET  /users_room/:id
GET  /users_room/rooms/:room_id/users
GET  /users_room/users/:user_id/rooms
DELETE /users_room/:id