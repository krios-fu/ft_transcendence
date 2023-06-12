from api.APITrans import APITrans as Api
import requests

# set roles
# set roles for default user
# set roles fot test user
# set rooms
base_url = 'http://localhost:3000'
user = 'danrodri'

def clean_state(api):
    users = requests.get(base_url + '/users/', api.get_param('auth_token')).json()
    rooms = requests.get(base_url + '/rooms/', api.get_param('auth_token')).json()
    roles = requests.get(base_url + '/roles/', api.get_param('auth_token')).json()
    for u in users:
        if u['username'] is api.get_param('cred_user'): # not true
            continue
        requests.delete(base_url + f'/users/{u["id"]}', api.get_param('auth_token'))
    for r in rooms:
        requests.delete(base_url + f'/rooms/{r["id"]}', api.get_param('auth_token'))
    for ro in roles:
        requests.delete(base_url + f'/roles/{ro["id"]}', api.get_param('auth_token'))
    

def set_state(api):
    [ api.post_role(role) for role in ['hola', 'que', 'tal']]
    [ api.post_room(room) for room in ['elromo', 'elromodue', 'elromotre'] ]


if __name__ == "__main__":
    api = Api()
    clean_state(api)
    set_state(api)

