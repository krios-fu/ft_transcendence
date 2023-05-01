from api.APITrans import APITrans as Api
import requests

if __name__ == '__main__':
    api = Api()
    user = api.post_user('usertest')
    api.set_user_creds('usertest')
    room = api.post_room('roomtest')

    r = requests.get('http://localhost:3000/user_rooms?filter[userId]=undefined', 
                    headers=api.get_param('auth_token'))
    print(f'[ RESULT ] {r.status_code}, {r.reason}')

    r = requests.get('http://localhost:3000/room_roles?filter[roleId]=holaqtal')
    print(f'[ RESULT ] {r.status_code}, {r.reason}')