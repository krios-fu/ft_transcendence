from api.APITrans import APITrans as Api
import requests
import sys
import json
from time import sleep

# compromabos roles de sala: { official, private }
# comprobamos roles de usuario: { owner, admin }
# comprobamos roles en sala: { room owner, room admin }
# y comprobamos la interacción entre estos roles


def pretty(json_e):
    return json.dumps(json_e, indent=2)


def reset_state(api):
    print('[ TESTEO URGENTE ]')
    print('-----> before cleanup')
    user_roles = requests.get('http://localhost:3000/user_roles', headers=api.get_param('auth_token')).json()
    print(f'{user_roles}')
    print('... clean state ...')
    users = requests.get('http://localhost:3000/users', headers=api.get_param('auth_token')).json()
    rooms = requests.get('http://localhost:3000/room', headers=api.get_param('auth_token')).json()
    roles = requests.get('http://localhost:3000/roles', headers=api.get_param('auth_token')).json()
    for user in users:
        print('asdasd')
        print(f'user: {users}')
        if user['username'] == api.get_param('api_user'):
            continue
        requests.delete(f'http://localhost:3000/users/{user["id"]}', headers=api.get_param('auth_token'))
    for room in rooms:
        requests.delete(f'http://localhost:3000/room/{room["id"]}', headers=api.get_param('auth_token'))
    for role in roles:
        requests.delete(f'http://localhost:3000/roles/{role["id"]}', headers=api.get_param('auth_token'))
    print('-----> after cleanup')
    user_roles = requests.get('http://localhost:3000/user_roles', headers=api.get_param('auth_token')).json()
    print(f'{user_roles}')
    print('...      OK     ...')

def clean_role(api, data):
    api.set_user_creds('admin')
    url = f'http://localhost:3000/room_roles/rooms/{data["roomId"]}/roles/{data["roleId"]}'
    print(f'[ CLEAN room_role {url} ]')
    r = requests.get(url, headers=api.get_param('auth_token'))
    print(f'[ mierda con el json: {r.text} ]')
    if r.status_code >= 400:
        print(f'->      [ FAILURE TO REQUEST URL {url} ] {r.status_code}, {r.reason}')
        return
    r_2 = requests.delete(f'http://localhost:3000/room_roles/{r.json()["id"]}', headers=api.get_param('auth_token'))
    print(f'[ CLEAN {r_2.status_code}, {r_2.reason}')


    # *** POST room_roles == private ***
def post_testing_battery(api):
    url = f'http://localhost:3000/room_roles/'
    clean_role(api, { 'roomId': rooms[2]['id'], 'roleId': roles[0]['id'] })
    clean_role(api, { 'roomId': rooms[2]['id'], 'roleId': roles[1]['id'] })
    for user in users:
        for role in roles[:2]:
            sleep(1)
            data = { 'roomId': rooms[2]['id'], 'roleId': role['id'] }
            api.set_user_creds(user['username'])
            print(f'\n[ ************************ petition from user || {user["username"]} || to make room {role["role"]} ************************ ]')
            print(f'[ POST {url} / {data}]')
            r = requests.post(url, data=data, headers=api.get_param('auth_token'))
            print(f'  -> results in {r.status_code}, {r.reason}, {r.text}')
            if r.status_code < 400:
                id = r.json()['id']
                r_clean = requests.delete(f'{url}{id}', headers=api.get_param('auth_token'))
                print(f'  -> remove room role... {r_clean.status_code}, {r_clean.text}')            
            if user['username'] == 'ro-owner' and role['role'] == 'official':
                assert r.status_code >= 400, 'Owner must be site owner, won\'t validate in guard tho'
                continue
            if user['username'] in ['owner', 'admin', 'ro-owner']:
                assert r.status_code < 400, 'User should had been able to perform this action'
            if user['username'] in ['user', 'ro-admin' ]:
                assert r.status_code >= 400, 'User should not be able to perform this action'
            print('[ ******************************************************************************************** ]\n\n')

    # *** DEL room_roles
    #     *** PRIVATE ***

def delete_testing_battery(api):
    private_room = api.post_room_role(rooms[0]['id'], roles[0]['id'])
    api.set_user_creds('admin')
    official_room = api.post_room_role(rooms[1]['id'], roles[1]['id'])

    for user in users:
        for role in roles[:2]:
            print(f'\n\n[ ************************ Trying to delete a {role["role"]} room role... user: {user["username"]} ************************ ]')
            api.set_user_creds(user['username'])
            if role["role"] == 'private':
                url = f'http://localhost:3000/room_roles/{private_room["id"]}'
            else:
                url = f'http://localhost:3000/room_roles/{official_room["id"]}'
            print(f'[ DELETE {url} ]')
            r = requests.delete(url, headers=api.get_param('auth_token'))
            print(f'  -> results in {r.status_code}, {r.reason}')
            if r.status_code < 400:
                if role["role"] == 'private':
                    private_room = api.post_room_role(rooms[0]['id'], roles[0]['id'])
                else:
                    official_room = api.post_room_role(rooms[1]['id'], roles[1]['id'])
            if user['username'] == 'ro-owner' and role['role'] == 'official':
                assert r.status_code >= 400, 'Owner must be site owner, won\'t validate in guard tho'
                continue
            if user['username'] in ['owner', 'admin', 'ro-owner']:
                assert r.status_code < 400, 'User should had been able to perform this action'
            if user['username'] in ['user', 'ro-admin' ]:
                assert r.status_code >= 400, 'User should not be able to perform this action'
            print('[ ******************************************************************************************** ]\n\n')



def password_testing_battery(api):
    private_role = api.post_role('private')
    # *** PASSWORD TEST ***
    # make a private room
    #  check that private room accepts a password
    #       create a public room with password payload -> ???
    # password payload goes into room role creation logic, a room does not have a
    # (public/private) password context
    #test_user = api.post_user('test_user')
    #test_room = api.post_room('test_room', test_user['id'])
    #       create a private room without password payload -> 400
    def TEST_create_private_room_role_without_password():
        print('[ TRYING to create a private room without a pw ]')
        test_user = api.post_user('test_user')
        test_room = api.post_room('test_room', test_user['id'])
        pvt_data = { 'roomId': test_room['id'], 'roleId': role['id']}
        role_pvt = requests.post('http://localhost:3000/room_roles', data=pvt_data)
        print(f'->    RESULT: {r.status_code}, {r.reason}')
#
    def TEST_create_private_room_role_with_password():
        pass
    #       create a room with password payload -> 201
    #  try next cases:
    #       user joins without password       -> 403
    #       user joins with wrong password    -> 403
    #       user joins with correct password  -> 201
    #
    #   [ update password ]
    # PUT /room_roles/room:id/passwrd -> y aqui se valida si hay rol y si es privado y los permisos
    # posting a private role without a password ??? deberia estar capado
    def TEST_update_password(api):
      password = 'validpass1234'
      public_room = api.post_room('public_room')
      private_room = api.post_room('private_room')
      private_room_role = api.post_room_role(
        private_room['id'], private_role['id'], password)
      # where to post password??

      print('[ TRY TO update a password of a public room ]')
      url = f'http://localhost:3000/room_roles/room/{public_room["id"]}/password'
      data = {'oldPassword': "si", 'newPassword': "tambien"}
      r = requests.put(url, headers=api.get_param('auth_token'), data=data)
      assert r.status_code === 400, 'why'

      for user in users:
        print(f'[ TRYING password update for {user['username']} ]')
        api.set_user_creds(user['username'])
        for pwd in ['bad-password', password]:
          payload = { 'password': pwd }
          r = requests.put(url, headers=api.get_param('auth_token'), data=payload)
          print(f'->    RESULT: {r.status_code}, {r.reason}')
        api.set_user_creds('admin')
        requests.put(url, headers=api.get_param('auth_token'), data={ 'password': password })
      # update a no private room
    #   try [ user, owner, admin, rowner, radmin ]
    #       [ bad_passwd, good_passwd ]_user = { 403, 403 }
    #       [ bad_passwd, good_passwd ]_owner = { 403, 201 }
    #       [ bad_passwd, good_passwd ]_admin = { 403, 201 }
    #       [ bad_passwd, good_passwd ]_rowner = { 403, 201 }    
    #       [ bad_passwd, good_passwd ]_radmin = { 403, 403 }

if __name__ == "__main__":
    api = Api()

    reset_state(api)
    #sys.exit(1)
    print('[ ********** setting up context *********** ]\n\n')
    print('[   -> roles ]')
    roles = [api.post_role(role) for role in ['private', 'official', 'owner', 'admin']]
    print('[   -> users ]')
    users = [ api.post_user(uname) for uname in ['user', 'owner', 'admin', 'ro-owner', 'ro-admn'] ]
    print('[   -> rooms ]')
    rooms = [ api.post_room(room, users[3]['id']) for room in ['private_room', 'official_room', 'room'] ]

    print('[   -> roles for users ]')
    owner = api.post_user_role(users[1]['id'], roles[2]['id'])
    admin = api.post_user_role(users[2]['id'], roles[3]['id'])
    # post admin in room
    api.post_user_room(users[4]['id'], rooms[0]['id'])
    room_admin = api.post_user_room_role(rooms[0]['id'], users[4]['id'], roles[3]['id'])

    private_room = api.post_room_role(rooms[0]['id'], roles[0]['id'])
    api.set_user_creds('admin')
    official_room = api.post_room_role(rooms[1]['id'], roles[1]['id'])
    print('[ **********         OK          ********** ]')

    #post_testing_battery(api)
    #delete_testing_battery(api)
