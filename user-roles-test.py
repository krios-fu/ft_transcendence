import requests
from api.APITrans import APITrans as Api
import json
import time

admin = 'danrodri'
user_name = 'usero'
room_name = 'rooma'
role_name = 'rolo'
base_url = 'http://localhost:3000'

def clean_state(api):
    users = requests.get(base_url + '/users/',
                         headers=api.get_param('auth_token')).json()
    rooms = requests.get(base_url + '/room/',
                         headers=api.get_param('auth_token')).json()
    roles = requests.get(base_url + '/roles/',
                         headers=api.get_param('auth_token')).json()
    for u in users:
        if u['username'] == user_name:
            requests.delete(base_url + f'/users/{u["id"]}',
                            headers=api.get_param('auth_token'))
    for r in rooms:
        if r['roomName'] == room_name:
            r = requests.delete(base_url + f'/room/{r["id"]}',
                            headers=api.get_param('auth_token'))
    for ro in roles:
        if ro['role'] == role_name:
            requests.delete(base_url + f'/roles/{ro["id"]}',
                            headers=api.get_param('auth_token'))


def post_global_role(api, user, role):
    payload = {
        'userId': user['id'],
        'roleId': role['id']
    }
    print(':: [ POST GLOBAL ROLE ] ::')
    r = requests.post(base_url + '/user_roles/',
                      headers=api.get_param('auth_token'),
                      data=payload)
    assert r.status_code == 201, r.json()
    print('\t... OK')
    assert r.json()['userId'] == user['id'], 'bad!'
    print('\t... OK')
    assert r.json()['roleId'] == role['id'], 'bad!'
    print('\t... OK')
    query = requests.get(base_url + f'/user_roles/{r.json()["id"]}',
                         headers=api.get_param('auth_token'))
    assert query.status_code == 200, query.json()
    print('\t... OK')    
    return r.json()['id']


def del_global_role(api, role_id):
    print(':: [ DEL GLOBAL ROLE ] ::')
    r = requests.delete(base_url + f'/user_roles/{role_id}',
                        headers=api.get_param('auth_token'))
    assert r.status_code == 204, r.json()
    print('\t... OK')
    query = requests.get(base_url + f'/user_roles/{role_id}',
                         headers=api.get_param('auth_token'))
    assert query.status_code == 404, query.json()
    print('\t... OK')    
    query_2 = query = requests.get(base_url + '/user_roles/',
                         headers=api.get_param('auth_token'))
    assert len(query_2.json()) == 3, 'bad!'
    print('\t... OK')    


if __name__ == "__main__":
    api = Api()
    api.set_user_creds(admin)
    clean_state(api)

    user = api.post_user(user_name)
    role = api.post_role(role_name)

    role_id = post_global_role(api, user, role)
    del_global_role(api, role_id)
