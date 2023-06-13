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


if __name__ == "__main__":
    api = Api()
    clean_state(api)
    roles = [ api.post_role(role) for role in ['hola', 'que', 'tal', 'banned']]
    rooms = [ api.post_room(room) for room in ['elromo', 'elromodue', 'elromotre'] ]
    id = requests.get(base_url + 'users/danrodri/', api.get_param('auth_token'))

# add a global role { 'global': ['hola'] }
r = requests.post(base_url + '/user_roles', {userId: id, roleId: roles[0]['id']}, , api.get_param('auth_token')))
# add a room role { 'global': ['hola'], 'elromo-Room': ['hola']'}
r = requests.post(base_url + '/user_room_roles', {userId: id, roleId: roles[0]['id']}, , api.get_param('auth_token')))
# add a banned role { 'global': ['hola'], 'elromo-Room': ['hola', 'banned']'}
r = requests.post(base_url + '/ban', {userId: id, roleId: roles[0]['id']}, , api.get_param('auth_token')))
# remove a room role { 'global': ['hola'], 'elromo-Room': ['banned']'}
r = requests.delete(base_url + '/user_roles', {userId: id, roleId: roles[0]['id']}, , api.get_param('auth_token')))
# add a banned role
r = requests.post(base_url + '/ban', {userId: id, roleId: roles[0]['id']}, , api.get_param('auth_token')))
# add two global roles
r = requests.post(base_url + '/user_roles', {userId: id, roleId: roles[0]['id']}, , api.get_param('auth_token')))
# remove every role
## get user roles
### purge
## get user room roles
### purge
## get ban roles
### purge


