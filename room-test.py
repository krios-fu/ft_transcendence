import sys
import json
import requests
from api.APITrans import APITrans


def pretty(json_obj):
    return json.dumps(json_obj, indent=2)

def del_user_as_owner(api):
    user = api.post_user('del-user')
    rooms = [api.post_room(room_id, user['id']) for room_id in ['rdel_user1', 'rdel_user2', 'rdel_user3']]

    print('[ Query room for users in first room (should be owner) ]')
    try: 
        url = f'http://localhost:3000/user_room/rooms/{rooms[0]["id"]}/users'
        r = requests.get(url, headers=api.get_param('auth_token'))
        r.raise_for_status()
        print(f'[ Query results ] {pretty(r.text)}')
    except requests.exceptions.HTTPError as e:
        print(f'[ logging HTTP exception... ] {str(e)}', file=sys.stderr)
        raise e
        
        # remove user
    try:
        r = requests.get('http://localhost:3000/room', headers=api.get_param('auth_token'))
        print(f'rooms before: {pretty(r.json())}')
        user_id = user['id']
        url = f'http://localhost:3000/users/{user_id}'
        r = requests.delete(url, headers=api.get_param('auth_token'))
        r.raise_for_status()
        r = requests.get('http://localhost:3000/room', headers=api.get_param('auth_token'))
        r = requests.delete(url, headers=api.get_param('auth_token'))
        print(f'rooms after: {pretty(r.json())}')
        r = requests.get(url, headers=api.get_param('auth_token'))
        print(f'user after: {pretty(r.json())}')
    except requests.exceptions.HTTPError as e:
        print(f'[ logging HTTP exception... ] {str(e)}', file=sys.stderr)
        raise e
        

def del_user_in_room_as_owner(api):
    users = [ api.post_user(user_name) for user_name in ['nuser-1', 'nuser-2', 'nuser-3' ] ]
    room = api.post_room('room_test', users[0]['id'])
    users_room = [ api.post_user_room(room['id'], user_id) for user_id in 
        [ user['id'] for user in users ]
    ]

    try:
        owner_id = users[0]['id']
        room_id = room['id']
        role_id = api.roles[0]['id']
        id = requests.get(
            f'http://localhost:3000/user_room/users/{owner_id}/rooms/{room_id}',
            headers=api.get_param('auth_token')
        ).json()
        print(f'id: ', id)
        del_url = f'http://localhost:3000/user_room/{id}'
        r = requests.delete(
            del_url,
            headers=api.get_param('auth_token')
        )
        print(f'[ DEL: {del_url} ]')
        print(f'return: {pretty(r.json())}')
        assert r.status_code == 400, 'should not allow owner to leave'
        user_room_1 = api.post_user_room_role(room_id, users[0]['id'], role_id)
        user_room_2 = api.post_user_room_role(room_id, users[1]['id'], role_id)
        del_url = f'http://localhost:3000/user_room/{id}'
        r = requests.delete(
            del_url,
            headers=api.get_param('auth_token')
        )
        print(f'[ DEL: {del_url} ]')
        print(f'return: {pretty(r.json())}')
        r = requests.get(f'http://localhost:3000/room/{room_id}', headers=api.get_param('auth_token'))
        print(f'new owner: {pretty(r.json())}')
        r = requests.delete(f'http://localhost:3000/user_room/{user_room_2["id"]}', headers=api.get_param('auth_token'))
        print(f'return: {pretty(r.json())}')
        r = requests.get(f'http://localhost:3000/room/{room_id}', headers=api.get_param('auth_token'))
        print(f'new owner: {pretty(r.json())}')
        r = requests.delete(f'http://localhost:3000/user_room/{user_room_1["id"]}', headers=api.get_param('auth_token'))
        print(f'return: {pretty(r.json())}')
        r = requests.get(f'http://localhost:3000/room/{room_id}', headers=api.get_param('auth_token'))
        print(f'return: {pretty(r.json())}')



    except requests.exceptions.ConnectionError:
        print('connection failure', file=sys.stderr)
        sys.exit(1)
    # put user in room
    # make user owner
    # remove user in room
    # query room, check owner
    pass


def main():
    # get token
    api = APITrans()

    # api.put_new_owner()
    #api.del_room_cascade_test()
    #print('[ ****************** DEL USER AS OWNER ****************** ]')
    #del_user_as_owner(api)
    print('[ ****************** DEL USERINROOM AS OWNER ****************** ]')
    del_user_in_room_as_owner(api)


if __name__ == '__main__':
    sys.exit(main())


# user room roles

"""
put new owner test: 
    the purpose of this test is to check and validate the new owner of the room we are trying to 
    update: new owner has to be registered in the room, and has to have an administrator role
    test we are going to make: posting an user not in the room, posting a non admin user, posting a valid user
    what we need: two users, one user_room, one role ('admin')

del room test: check if cascade has been correctly set up: add multiple user_room entities on a room,
    then delete that room and check if these entities still exist.

del user as owner: 
    should remove every room user is owner:
    1. make a query to get all rooms in which user is owner
    2. delete user
    3. make a query with every room id, check that every petition returns 404

del user in room as room owner:
    cases:
    1. i am owner and unique user in a room
    2. i am owner and there is no other admin in room
    3. i am owner and there is three admins in rooom

"""