from api.APITrans import APITrans as Api
import requests
import json

# set roles
# set roles for default user
# set roles fot test user
# set rooms
base_url = 'http://localhost:3000'
user = 'danrodri'

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


if __name__ == "__main__":
    api = Api()
    clean_state(api)
    print('[ cleaning state ]')
    input()
    roles = [ api.post_role(role) for role in ['hola', 'l', 'tal', 'banned']]
    rooms = [ api.post_room(room) for room in ['elromo', 'elromodue', 'elromotre'] ]
    id = requests.get(base_url + '/users/danrodri/', headers=api.get_param('auth_token')).json()['id']

    #print('\n\t ~~ [ ban from room ] ~~')
    br1 = requests.post(base_url + '/ban', {'userId': id, 'roomId': rooms[0]['id']}, headers=api.get_param('auth_token')).json()

    print(' ~~ [ global role testing ] ~~')
    r_grTest = requests.post(base_url + '/user_roles/', {'userId':id, 'roleId':roles[2]["id"]}, headers=api.get_param('auth_token'))
    input()

    print(' ~~ [ global ban ] ~~ ')
    coso = requests.post(base_url + '/user_roles/', {'userId':id, 'roleId': roles[3]["id"]}, headers=api.get_param('auth_token'))
    print(f'what we got: {coso.json()}')
    input()

    print('\n\t ~~ [ add a global role ] ~~')
    gr1 = requests.post(base_url + '/user_roles', {'userId': id, 'roleId': roles[0]['id']}, headers=api.get_param('auth_token')).json()
    pretty_print(gr1)
    input()

    print('\n\t ~~ [ add a room role ] ~~')
    api.set_user_creds('danrodri')
    rol = requests.post(base_url + '/user_room', {'roomId': rooms[0]['id']}, headers=api.get_param('auth_token')).json()
    ur = requests.post(base_url + '/user_room_roles', {'userId': id, 'roleId': roles[0]['id'], 'roomId': rooms[0]['id']}, headers=api.get_param('auth_token')).json()
    pretty_print(ur)
    input()

    print('\n\t ~~ [ add a banned role ] ~~')
    br1 = requests.post(base_url + '/ban', {'userId': id, 'roomId': rooms[0]['id']}, headers=api.get_param('auth_token')).json()
    pretty_print(br1)
    input()    

    print('\n\t ~~ [ remove a room role ] ~~')
    dr1 = requests.delete(base_url + f'/user_roles/{ur["id"]}', headers=api.get_param('auth_token')).json()
    pretty_print(dr1)
    input()    

    print('\n\t ~~ [ add a banned role ] ~~')
    br2 = requests.post(base_url + '/ban', {'userId': id, 'roomId': rooms[1]['id']}, headers=api.get_param('auth_token')).json()
    pretty_print(br2)
    input()    

    print('\n\t ~~ [ add two global roles ] ~~')
    gr2 = requests.post(base_url + '/user_roles', {'userId': id, 'roleId': roles[1]['id']}, headers=api.get_param('auth_token')).json()
    gr3 = requests.post(base_url + '/user_roles', {'userId': id, 'roleId': roles[2]['id']}, headers=api.get_param('auth_token')).json()
    pretty_print(gr2)
    pretty_print(gr3)
    input()    

    ''' remove every role '''
    print('\n\t ~~ [ remove every role ] ~~')

    ## purge user roles
    print('\n\t ~~ [ purging user roles... ] ~~')
    global_roles = requests.get(base_url + '/user_roles/', headers=api.get_param('auth_token')).json()
    pretty_print(global_roles)
    for role in global_roles:
        requests.delete(base_url + f'/user_roles/{role["id"]}', headers=api.get_param('auth_token'))

    ## purge user room roles
    print('\n\t ~~ [ purging user room roles... ] ~~')    
    room_roles = requests.get(base_url + '/user_room_roles/', headers=api.get_param('auth_token')).json()
    pretty_print(room_roles)    
    for role in room_roles:
        requests.delete(base_url + f'/user_room_roles/{role["id"]}', headers=api.get_param('auth_token'))

    ## purge ban roles
    print('\n\t ~~ [ purging ban roles... ] ~~')    
    bans = requests.get(base_url + '/ban/', headers=api.get_param('auth_token')).json()
    pretty_print(bans)
    for ban in bans:
        requests.delete(base_url + f'/ban/{ban["id"]}', headers=api.get_param('auth_token'))



