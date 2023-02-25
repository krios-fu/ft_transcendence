import sys
import requests
from requests import HTTPError
import os
from dotenv import load_dotenv
# TEMPORAL, ESTO TIENE QUE IMPLEMENTARSE EN LA BATERIA DE E2E EN JEST


def generate_credentials(user):
    load_dotenv()
    api_id = os.getenv('FORTYTWO_APP_ID')
    secret_id = os.getenv('FORTYTWO_APP_SECRET')
    token_creds = {
        'userProfile': {
            'username': user,
            'firstName': f'{user}-fn',
            'lastName': f'{user}-ln',
            'profileUrl': 'none',
            'email': f'{user}@test.com',
            'photoUrl': 'none'
        },
        'app_id': api_id,
        'app_secret': secret_id
    }
    token_url = 'http://localhost:3000/auth/generate'

    r = requests.post(token_url, json=token_creds, timeout=0.2)
    return r.json()['accessToken']


def post_user(username, auth_token):
    url = 'http://localhost:3000/user'
    headers = auth_token
    data = {
        'username': username,
        'firstName': f'{username}-fn',
        'lastName': f'{username}-ln',
        'profileUrl': f'{username}-pu',
        'email': f'{username}-e',
        'photoUrl': f'{username}-pu'
    }
    try:
        r = requests.post(url, headers=headers, data=data)
        r.raise_for_status()
    except HTTPError:
        print('Error trying to post an user')
        sys.exit(1)

def post_room(roomname, ownerId, auth_token):
    url = 'http://localhost:3000/room'
    headers=auth_token
    data = {
        'roomName': roomname,
        'ownerId': ownerId
    }
    try:
        r = requests.post(url, headers=headers, data=data)
        r.raise_for_status()
    except HTTPError:
        print('Error trying to post a room')
        sys.exit(1)

def post_user_room(roomId, userId, auth_token):
    url = 'http://localhost:3000/user_room'
    headers = auth_token
    data = {
        'userId': userId,
        'roomId': roomId
    }
    try:
        r = requests.post(url, headers=headers, data=data)
        r.raise_for_status()
    except HTTPError:
        print('Error trying to post a user_room')
        sys.exit(1)

def del_room_cascade_test(auth_token):
    for u in [ 'user-1', 'user-2', 'user-3' ]:
        post_user(u, auth_token)
    for i, r in enumerate([ 'room-1', 'room-2', 'room-3' ]):
        post_room(r, i, auth_token)
    for i in range(3):
        post_user_room(1, i, auth_token)
    r = requests.get('https://localhost:3000/users_room/room/1', headers=auth_token)        
    print(f'[ WHAT WE\'VE GOT ]', r.json())
    try:
        r = requests.delete('http://localhost:3000/room/1', headers=auth_token)
        r.raise_for_status()
    except HTTPError:
        print('Error trying to delete a room')
        sys.exit(1)
    r = requests.get('https://localhost:3000/users_room/room/1', headers=auth_token)
    print(f'[ WHAT WE\'VE LEFT ]', r.json())

def put_new_owner(auth_token):
    # put a valid new owner and check
    # r = requests.get('https://localhost:3000/')
    # put an invalid new owner (not in room, does not exist)
    pass

def del_user_as_owner(auth_token):
    # put user in room
    # remove user
    # query room, check owner
    pass

def del_user_in_room_as_owner(auth_token):
    # put user in room
    # make user owner
    # remove user in room
    # query room, check owner
    pass


def main():
   # get token
    auth_token = generate_credentials('test')

    print('[ STARTING TESTS... ]')
    print('[ ... ]')
    print('[ PUT NEW OWNER TESTS ]')
    put_new_owner(auth_token)
    print('[ DEL ROOM TESTS ]')
    del_room_cascade_test(auth_token)
    #print('[ DEL USER AS OWNER TESTS ]')
    #del_user_as_owner(auth_token)
    #print('[ DEL USER IN ROOM AS OWNER ]')
    #del_user_in_room_as_owner(auth_token)
    #print('[ REMOVE ROOM IF NO USERS ARE PRESEENT ]')


if __name__ == '__main__':
    sys.exit(main())