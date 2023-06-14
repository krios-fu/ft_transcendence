from api.APITrans import APITrans as Api
import requests

# set roles
# set roles for default user
# set roles fot test user
# set rooms
base_url = 'http://localhost:3000'
user = 'danrodri'

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


if __name__ == "__main__":
    api = Api()
    clean_state(api)
    roles = [ api.post_role(role) for role in ['hola', 'que', 'tal', 'banned']]
    rooms = [ api.post_room(room) for room in ['elromo', 'elromodue', 'elromotre'] ]
    id = requests.get(base_url + '/users/danrodri/', headers=api.get_param('auth_token')).json()['id']
    ''' add a global role { 'global': ['hola'] } '''

    gr1 = requests.post(base_url + '/user_roles', {'userId': id, 'roleId': roles[0]['id']}, headers=api.get_param('auth_token'))
    ''' add a room role { 'global': ['hola'], 'elromo-Room': ['hola']'} '''

    api.set_user_creds('danrodri')
    rol = requests.post(base_url + '/user_room', {'roomId': rooms[0]['id']}, headers=api.get_param('auth_token'))
    ur = requests.post(base_url + '/user_room_roles', {'userId': id, 'roleId': roles[0]['id'], 'roomId': rooms[0]['id']}, headers=api.get_param('auth_token')).json()
    ''' add a banned role { 'global': ['hola'], 'elromo-Room': ['hola', 'banned']'} '''

    print(f'Control de existencias: {ur}, {rol.json()}')
    br1 = requests.post(base_url + '/ban', {'userId': id, 'roleId': roles[0]['id']}, headers=api.get_param('auth_token'))
    ''' remove a room role { 'global': ['hola'], 'elromo-Room': ['banned']'} '''

    dr1 = requests.delete(base_url + f'/user_roles/{ur["id"]}', headers=api.get_param('auth_token'))
    ''' add a banned role { 'global': ['hola'], 'elromo-Room': ['banned'] } '''

    r = requests.post(base_url + '/ban', {'userId': id, 'roleId': roles[0]['id']}, headers=api.get_param('auth_token'))
    ''' add two global roles { 'global': ['hola', 'que', 'tal'], 'elromo-Room': ['banned'] } '''

    r = requests.post(base_url + '/user_roles', {'userId': id, 'roleId': roles[1]['id']}, headers=api.get_param('auth_token'))
    r = requests.post(base_url + '/user_roles', {'userId': id, 'roleId': roles[2]['id']}, headers=api.get_param('auth_token'))
    ''' remove every role '''

    ## purge user roles
    global_roles = requests.get(base_url + '/user_roles/', api.get_param('auth_token')).json()
    for role in global_roles:
        requests.delete(base_url + f'/user_roles/{role["id"]}', api.get_param('auth_token')).json()

    ## purge user room roles
    room_roles = requests.get(base_url + '/user_room_roles/', api.get_param('auth_token')).json()
    for role in room_roles:
        requests.delete(base_url + f'/user_room_roles/{role["id"]}', api.get_param('auth_token')).json()

    ## purge ban roles
    bans = requests.get(base_url + '/ban/', api.get_param('auth_token')).json()
    for ban in bans:
        requests.delete(base_url + f'/ban/{ban["id"]}', api.get_param('auth_token')).json()



