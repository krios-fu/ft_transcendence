from api.APITrans import APITrans as Api
import requests
import json

base_url = 'http://localhost:3000'
admin = 'danrodri'


def pretty_print(fmt):
    print(json.dumps(fmt, indent=2))


def clean_state(api):
    users = requests.get(base_url + '/users/', headers=api.get_param('auth_token')).json()
    rooms = requests.get(base_url + '/room/', headers=api.get_param('auth_token')).json()
    roles = requests.get(base_url + '/roles/', headers=api.get_param('auth_token')).json()
    api.set_user_creds(admin)
    for u in users:
        if u["username"] in [api.get_param('api_user'), "danrodri", "krios-fu", "onapoli-"]:
            continue
        r = requests.delete(base_url + f'/users/{u["id"]}', headers=api.get_param('auth_token'))
    for r in rooms:
        if r["roomName"] in ["wakanda", "metropolis", "atlantis"]:
            continue
        requests.delete(base_url + f'/room/{r["id"]}', headers=api.get_param('auth_token'))
    for ro in roles:
        if ro['role'] == 'bobo':
            requests.delete(base_url + f'/roles/{ro["id"]}', headers=api.get_param('auth_token'))


def set_user(payload, api):
    api.set_user_creds(admin)
    r = requests.post(base_url + '/users/',
                      data=payload,
                      headers=api.get_param('auth_token'))
    return r.json()


def set_room(api):
    api.set_user_creds(admin)
    r = requests.post(base_url + '/room/',
                      headers=api.get_param('auth_token'),
                      data={ 'roomName': 'laromada' })
    return r.json()


def set_role(api):
    api.set_user_creds(admin)
    r = requests.post(base_url + '/roles/',
                      headers=api.get_param('auth_token'),
                      data={ 'role': 'bobo' })
    return r.json()


if __name__ == "__main__":
    api = Api()
    clean_state(api)

    # ~~ post user tests ~~
    print('~~ [ post user tests ] ~~')
    print('\t --> as admin')
    api.set_user_creds(admin)
    payload = {
        'username': 'user',
        'firstName': 'user-fn',
        'lastName': 'user-ln',
        'profileUrl': 'nada',
        'email': 'nada@mail.com',
        'photoUrl': 'nada'
    }
    r = requests.post(base_url + '/users/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 201, f'{r.json()}'
    input()
    user = r.json()

    print('\t --> as user')
    api.set_user_creds(user['username'])
    payload = {
        'username': 'user2',
        'firstName': 'user2-fn',
        'lastName': 'user2-ln',
        'profileUrl': 'nada',
        'email': 'nada@mail.com',
        'photoUrl': 'nada'
    }
    r = requests.post(base_url + '/users/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 403, f'{r.json()}'
    input()

    user2 = set_user(payload, api)
    print('~~ [ delete user tests ] ~~')
    print('\t --> as user')
    api.set_user_creds(user['username'])
    r = requests.delete(base_url + f'/users/{user2["id"]}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 403, f'{r.json()}'
    input()

    print('\t --> as admin')
    api.set_user_creds(admin)
    r = requests.delete(base_url + f'/users/{user2["id"]}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 204, f'{r.json()}'
    input()

    print('~~ [ ban user tests ] ~~')
    room = set_room(api)
    payload = {
        'userId': user['id'],
        'roomId': room['id']
    }
    print('\t --> as user')    
    api.set_user_creds(user['username'])
    r = requests.post(base_url + '/ban/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 403, f'{r.json()}'
    input()

    api.set_user_creds(admin)
    print('\t --> as admin')
    r = requests.post(base_url + '/ban/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 201, f'{r.json()}'
    input()
    banned_role = r.json()

    print('~~ [ post role tests ] ~~')
    role = set_role(api)
    api.set_user_creds(user['username'])
    print('\t --> as banned user')
    payload = {
        'userId': user["id"],
        'roomId': room["id"],
        'roleId': role["id"]
    }
    r = requests.post(base_url + '/user_room_roles/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 403, f'{r.json()}'
    input()

    print('\t --> >> remove as admin << ')
    api.set_user_creds(admin)
    r = requests.delete(base_url + f'/ban/{banned_role["id"]}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 204, f'{r.json()}'

    # --- post user in room ---
    api.set_user_creds(user['username'])
    test = requests.post(base_url + '/user_room/', 
                  headers=api.get_param('auth_token'),
                  data={'roomId': room["id"]})
    # ---                   --- 
    api.set_user_creds(user['username'])
    print('\t --> as user')
    r = requests.post(base_url + '/user_room_roles/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 403, f'{r.json()}'
    input()

    api.set_user_creds(admin)
    print('\t --> as admin')
    r = requests.post(base_url + '/user_room_roles/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 201, f'{r.json()}'
    input()
    room_role = r.json()

    print('~~ [ remove role tests ] ~~')
    api.set_user_creds(user['username'])
    r = requests.delete(base_url + f'/user_room_roles/{room_role["id"]}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 403, f'{r.json()}'
    input()

    api.set_user_creds(admin)
    print('\t --> as admin')
    r = requests.delete(base_url + f'/user_room_roles/{room_role["id"]}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 204, f'{r.json()}'
    input()