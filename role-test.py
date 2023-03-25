from api.APITrans import APITrans as Api
import requests
import sys
import json

# compromabos roles de sala: { official, private }
# comprobamos roles de usuario: { owner, admin }
# comprobamos roles en sala: { room owner, room admin }
# y comprobamos la interacción entre estos roles


def pretty(json_e):
    return json.dumps(json_e, indent=2)


def clean_role(api, data):
    url = f'http://localhost:3000/room_roles/room/{data["roomId"]}/roles/{data["roleId"]}'
    print(f'[ CLEAN room_role {url} ]')
    r = requests.get(url, headers=api.get_param('auth_token'))
    if r.status_code >= 400:
        print('[ OOPS ]')
        return
    r = requests.delete(f'http://localhost:3000/room_roles/{r.json["id"]}', headers=api.get_param('auth_token'))
    print(f'[ CLEAN {r.status_code}')

if __name__ == "__main__":
    api = Api()

    print('[ ******************************************************************************************** ]')
    users = [ api.post_user(uname) for uname in ['user', 'owner', 'admin', 'ro-owner', 'ro-admn'] ]
    roles = [ api.post_role(role) for role in ['private', 'official', 'owner', 'admin'] ]
    rooms = [ api.post_room(room, users[3]['id']) for room in ['private_room', 'official_room', 'room'] ]

    print('Users: ', pretty(users))
    print('Rooms: ', pretty(rooms))
    print('Roles: ', pretty(roles))

    owner = api.post_user_role(users[1]['id'], roles[2]['id'])
    admin = api.post_user_role(users[2]['id'], roles[3]['id'])
    # post admin in room
    api.post_user_room(users[4]['id'], rooms[0]['id'])
    room_admin = api.post_user_room_role(rooms[0]['id'], users[4]['id'], roles[3]['id'])

    private_room = api.post_room_role(rooms[0]['id'], roles[0]['id'])
    official_room = api.post_room_role(rooms[1]['id'], roles[0]['id'])
    print('[ ******************************************************************************************** ]')

    # *** POST room_roles == private *** 
    url = f'http://localhost:3000/room_roles/'
    for user in users:
        for role in roles[:2]:
            data = { 'roomId': rooms[2]['id'], 'roleId': role['id'] }
            api.set_user_creds(user['username'])
            print(f'[ ************************ petition from user {user["username"]} to make room {role["role"]} ************************ ]')
            clean_role(api, data)
            print(f'[ POST {url} / {data}]')
            r = requests.post(url, data=data, headers=api.get_param('auth_token'))
            print(f'  -> results in {r.status_code}, {r.reason}')
            if r.status_code < 400:
                id = r.json()['id']
                r = requests.delete(f'{url}{id}', headers=api.get_param('auth_token'))
                print(f'  -> remove room role... {r.status_code}')
            print('[ ******************************************************************************************** ]')

    # *** DEL room_roles
    #     *** PRIVATE ***
    for user in users:
        print(f'[ Trying to delete a private room role... {user["username"]}]')
        api.set_user_creds(user['username'])
        url = f'http://localhost/room_roles/{private_room["id"]}'
        r = requests.delete(url, headers=api.get_param('auth_token'))
        print(f'  -> results in {r.status_code}, {r.reason}')
        if r.status_code < 400:
            private_room = api.post_room_role(rooms[0]['id'], roles[0]['id'])
    #     *** OFFICIAL ***

#    del_re
