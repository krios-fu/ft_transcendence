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
    for u in users:
        if u["username"] in [api.get_param('api_user'), "danrodri"]:
            continue
        requests.delete(base_url + f'/users/{u["id"]}', headers=api.get_param('auth_token'))
    for r in rooms:
        requests.delete(base_url + f'/room/{r["id"]}', headers=api.get_param('auth_token'))
    for ro in roles:
        requests.delete(base_url + f'/roles/{ro["id"]}', headers=api.get_param('auth_token'))


def set_user(payload, api):
    api.set_user_creds(admin)
    r = requests.post('https://localhost/user/',
                      data=payload,
                      headers=api.get_param('auth_token'))
    return r.json()


def set_room(api):
    api.set_user_creds(admin)
    r = requests.post('https://localhost/room/',
                      headers=api.set_param('auth_token'),
                      data={ 'roomname': 'loromo' })
    return r.json()


def set_role(api):
    api.set_user_creds(admin)
    r = requests.post('https://localhost/role/',
                      headers=api.set_param('auth_token'),
                      data={ 'role': 'bobo' })
    return r.json()


if __name__ == "__main__":
    api = Api()
    clean_state(api)

    # ~~ post user tests ~~
    print('~~ [ post user tests ] ~~')
    api.set_user_creds(admin)
    payload = {
        'username': 'user',
        'firstName': 'user-fn',
        'lastName': 'user-ln',
        'profileUrl': 'nada',
        'email': 'nada',
        'photoUrl': 'nada'
    }
    r = requests.post('https://localhost/user/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 201
    user = r.json()

    api.set_user_creds(user['username'])
    payload = {
        'username': 'user2',
        'firstName': 'user2-fn',
        'lastName': 'user2-ln',
        'profileUrl': 'nada',
        'email': 'nada',
        'photoUrl': 'nada'
    }
    r = requests.post('https://localhost/user/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 403

    user2 = set_user(payload, api)
    print('~~ [ delete user tests ] ~~')
    api.set_user_creds(user['username'])
    r = requests.delete(f'https://localhost/user/{user2["id"]}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 403

    api.set_user_creds(admin)
    r = requests.delete(f'https:://localhost/user/{user2["id"]}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 204

    print('~~ [ ban user tests ] ~~')
    room = set_room(api)
    payload = {
        'userId': user['id'],
        'roomId': room['id']
    }
    api.set_user_creds(user['username'])
    r = requests.post('https://localhost/ban/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 403

    api.set_user_creds(admin)
    r = requests.post('https://localhost/ban/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 201
    banned_role = r.json()

    role = set_role(api)
    api.set_user_creds(user['username'])
    payload = {
        'userId': user["id"],
        'roomId': room["id"],
        'roleId': role["id"]
    }
    r = requests.post('https://localhost/user_room_role/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 403

    api.set_user_creds(admin)
    r = requests.delete(f'https://localhost/user_room_role/{banned_role["id"]}',
                        headers=api.get_param('auth_token'))

    api.set_user_creds(user['username'])
    r = requests.post('https://localhost/user_room_role/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 403

    api.set_user_creds(admin)
    r = requests.post('https://localhost/user_room_role/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 201
    room_role = r.json()

    api.set_user_creds(user['username'])
    r = requests.delete(f'https://localhost/user_room_role/{room_role["id"]}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 403

    api.set_user_creds(admin)
    r = requests.delete(f'https://localhost/user_room_role/{room_role["id"]}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 204