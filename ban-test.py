import requests
from api.APITrans import APITrans as Api
import json
import time

admin = 'danrodri'
base_url = 'http://localhost:3000'

def clean_state(api):
    rooms = requests.get(base_url + '/room/',
                         headers=api.get_param('auth_token')).json()
    users = requests.get(base_url + '/users/',
                         headers=api.get_param('auth_token')).json()
    roles = requests.get(base_url + '/roles/',
                         headers=api.get_param('auth_token')).json()
    for r in rooms:
        if r['roomName'] == 'rooma':
            requests.delete(base_url + f'/room/{r["id"]}',
                            headers=api.get_param('auth_token'))
    for u in users:
        if u['username'] == 'user':
            requests.delete(base_url + f'/users/{u["id"]}',
                headers=api.get_param('auth_token'))
    for ro in roles:
        if ro['role'] == 'rola':
            requests.delete(base_url + f'/roles/{ro["id"]}',
                            headers=api.get_param('auth_token'))
            

def post_ban(api, user, room):
    print(' ~~ [ POSTING A BAN TEST ] ~~')
    payload = {
        'userId': user['id'],
        'roomId': room['id']
    }
    r = requests.post(base_url + '/ban/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 201, r.json()
    print('\tpost... OK')    
    query = requests.get(base_url + '/ban/',
                         headers=api.get_param('auth_token'))
    assert len(query.json()) == 1, query.json()
    print('\tquery... OK')    
    assert query.json()[0]['id'] == r.json()['id'], 'bad query'
    print('\tcheck id... OK')    
    return r.json()['id']


def del_ban(api, role):
    print(' ~~ [ DELETING A BAN TEST ] ~~')
    r = requests.delete(base_url + f'/ban/{role}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 204, r.json()
    print('\tdelete... OK')
    query = requests.get(base_url + '/ban/',
                         headers=api.get_param('auth_token'))
    assert len(query.json()) == 0, 'ban did not erase'
    print('\tquery list... OK')
    query_2 = requests.get(base_url + f'/ban/{role}',
                           headers=api.get_param('auth_token'))
    assert query_2.status_code == 404, 'ban did not erase'
    print('\tquery detail... OK')


def post_role(api, user, room, role):
    print(' ~~ [ POSTING A ROLE TEST ] ~~')
    payload = {
        'userId': user['id'],
        'roomId': room['id'],
        'roleId': role['id']
    }
    api.set_user_creds('user')
    r = requests.post(base_url + '/user_room/',
                  headers=api.get_param('auth_token'),
                  data={'roomId': room['id']})
    assert r.status_code == 201, r.json()
    api.set_user_creds(admin)
    role = requests.post(base_url + '/user_room_roles/',
                           headers=api.get_param('auth_token'),
                           data=payload)
    assert role.status_code == 201, role.json()
    print('\tpost... OK')    
    query = requests.get(base_url + '/user_room_roles/',
                         headers=api.get_param('auth_token'))
    assert len(query.json()) == 4, 'did not post role'
    print('\tquery list... OK')    
    assert query.json()[-1]['id'] == role.json()['id'], 'bad posting'
    print('\tcheck id... OK')
    return role.json()['id']


def del_role(api, role):
    print(' ~~ [ DELETING A ROLE TEST ] ~~')
    r = requests.delete(base_url + f'/user_room_roles/{role}',
                           headers=api.get_param('auth_token'))
    assert r.status_code == 204, r.json()
    print('\tdelete... OK')
#    time.sleep(0.5)
    query = requests.get(base_url + '/user_room_roles/',
                         headers=api.get_param('auth_token'))
    assert len(query.json()) == 3, 'did not del role'
    print('\tquery list... OK')
    query_2 = requests.get(base_url + f'/user_room_roles/{role}',
                         headers=api.get_param('auth_token'))
    assert query_2.status_code == 404, 'did not del role'
    print('\tquery detail... OK')    


if __name__ == "__main__":
    api = Api()
    api.set_user_creds(admin)
    clean_state(api)
    user = api.post_user('user')
    room = api.post_room('rooma')
    role = api.post_role('rola')

    ban_id = post_ban(api, user, room)
    del_ban(api, ban_id)
    rol_id = post_role(api, user, room, role)
    del_role(api, rol_id)