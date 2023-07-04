import requests
from api.APITrans import APITrans as Api
import json

# creamos un usuario
# creamos una sala
# intentamos darle un rol al usuario en la sala (falla)
# unimos al usuario a la sala
# query assertion
# baneamos al usuario de la sala
# query assertion
# query assertion: no existe rol en sala
# query assertion: no existe usuario en room
# usuario intenta unirse a la sala

admin = 'danrodri'
user_name = 'usero'
room_name = 'rooma'
role_name = 'rolo'
base_url = 'http://localhost:3000'

def clean_state(api):
    users = requests.get(base_url + '/users/',
                         headers=api.get_param('auth_token'))
    rooms = requests.get(base_url + '/room/',
                         headers=api.get_param('auth_token'))
    roles = requests.get(base_url + '/roles/',
                         headers=api.get_param('auth_token'))
    for u in users:
        if u['username'] == user_name:
            requests.delete(base_url + f'/users/{u["id"]}',
                            headers=api.get_param('auth_token'))
    for r in rooms:
        if r['roomName'] == room_name:
            requests.delete(base_url + f'/rooms/{r["id"]}',
                            headers=api.get_param('auth_token'))
    for ro in roles:
        if ro['role'] == role_name:
            requests.delete(base_url + f'/roles/{ro["id"]}',
                            headers=api.get_param('auth_token'))

if __name__ == "__main__":
    api = Api()
    api.set_user_creds(admin)
    pass