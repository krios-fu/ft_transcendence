import requests
from api.APITrans import APITrans as Api
import json

admin = 'danrodri'
base_url = 'http://localhost:3000'


def clean_state(api):
    rooms = requests.get(base_url + '/room/',
                         headers=api.get_param('auth_token')).json()
    users = requests.get(base_url + '/users/',
                         headers=api.get_param('auth_token')).json()
    for r in rooms:
        if r['roomName'] == 'rooma':
            requests.delete(base_url + f'/room/{r["id"]}',
                            headers=api.get_param('auth_token'))
    for u in users:
        if u['username'] == 'user':
            requests.delete(base_url + f'/users/{u["id"]}',
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
    query = requests.get(base_url + '/ban/',
                         headers=api.get_param('auth_token'))
    assert len(query.json()) == 1, query.json()
    assert query.json()[0].id == r.id, 'bad query'
    return r.id


def del_ban(api, role):
    print('~~ [ DELETING A BAN TEST ] ~~')
    r = requests.delete(base_url + f'/ban/{role}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 204, r.json()
    query = requests.get(base_url + '/ban/')
    assert len(query.json()) == 0, 'ban did not erase'
    query_2 = requests.get(base_url + f'/ban/{role}',
                           headers=api.get_param('auth_token'))
    assert query_2.status_code == 404, 'ban did not erase'


def post_role(api, user, room, role):
    payload = {
        'userId': user['id'],
        'roomId': room['id'],
        'roleId': role['id']
    }
    role = requests.post(base_url + '/user_room_roles/',
                           headers=api.get_param('auth_token'),
                           data=payload)
    assert role.status_code == 201, role.json()
    query = requests.get(base_url + '/user_room_roles/',
                         headers=api.get_param('auth_token'))
    assert len(query.json()) == 1, 'did not post role'
    assert query.json()[0]['id'] == role['id'], 'bad posting'
    return role['id']


def del_role(api, role):
    r = requests.delete(base_url + f'/user_room_roles/{role}',
                           headers=api.get_param('auth_token'))
    assert r.status_code == 204, r.json()
    query = requests.get(base_url + '/user_room_roles/',
                         headers=api.get_param('auth_token'))
    assert len(query.json()) == 0, 'did not del role'
    query_2 = requests.get(base_url + f'/user_room_roles/{role}',
                         headers=api.get_param('auth_token'))
    assert query_2.status_code == 404, 'did not del role'


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