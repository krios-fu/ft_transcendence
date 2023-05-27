from api.APITrans import APITrans as Api
import requests

def reset_state(api):
    users = requests.get('http://localhost:3000/users', headers=api.get_param('auth_token')).json()
    rooms = requests.get('http://localhost:3000/room', headers=api.get_param('auth_token')).json()
    roles = requests.get('http://localhost:3000/roles', headers=api.get_param('auth_token')).json()

    for user in users:
        if user['username'] == api.get_param('api_user'):
            continue
        requests.delete(f'http://localhost:3000/users/{user["id"]}', headers=api.get_param('auth_token'))
    for room in rooms:
        requests.delete(f'http://localhost:3000/room/{room["id"]}', headers=api.get_param('auth_token'))
    for role in roles:
        requests.delete(f'http://localhost:3000/roles/{role["id"]}', headers=api.get_param('auth_token'))


if __name__ == '__main__':
    print('[ TEST register a private room ]')
    api = Api()
    reset_state(api)
    user = api.post_user('user')
    role = api.post_role('private')
    api.set_user_creds('user')
    payload = { 
        'roomName': 'room',
        'password': '1234567890123'
    }
    r = requests.post('http://localhost:3000/room/private', data=payload, headers=api.get_param('auth_token'))
    print(f'[ RETURN: {r.status_code}, {r.reason} ]')

    r = requests.get('http://localhost:3000/room_roles', headers=api.get_param('auth_token'))
    print(f'[ ROOM ROLES: {r.json()} ]')

    r = requests.get('http://localhost:3000/room', headers=api.get_param('auth_token'))
    print(f'[ ROOMS: {r.json()} ]')
