from dotenv import load_dotenv
from pathlib import Path
import sys
import os
import requests

class APITrans():
    def __init__(self, *args, **kwargs):
        load_dotenv()
        for key, value in kwargs.items():
            self.set_param(key, value)
        api_id = os.getenv('FORTYTWO_APP_ID')
        api_secret = os.getenv('FORTYTWO_APP_SECRET')
        if api_id is None or api_secret is None:
            raise Exception('api credentials were not provided')
        self.set_param('api_id', api_id)
        self.set_param('api_secret', api_secret)
        self.__get_creds('admin')
        self.__seed_db()

    def set_param(self, key, value):
        self.__dict__[key] = value

    def get_param(self, key):
        return self.__dict__[key]

    def __get_creds(self, user):
        token_creds = {
                'userProfile': {
                'username': user,
                'firstName': f'{user}-fn',
                'lastName': f'{user}-ln',
                'profileUrl': 'none',
                'email': f'{user}@test.com',
                'photoUrl': 'none'
            }, 
            'app_id': self.get_param('api_id'),
            'app_secret': self.get_param('api_secret')
        }
        token_url = 'http://localhost:3000/auth/generate'
        try:
            r = requests.post(token_url, json=token_creds)
            r.raise_for_status()
        except requests.exceptions.ConnectionError as e:
            print('Error trying to establish a connection to API', file=sys.stderr)
            raise Exception('FATAL')
        except requests.exceptions.HTTPError as e:
            print(f'Caught exception: {str(e)}')
            raise e
        token = r.json()['accessToken']
        self.set_param('auth_token', { 'Authorization': f'Bearer {token}' })

    def __request_get_wrapper(self, url):
        """ Requests entity detail view via ID. """
        print(f'  [ GET: {url} ]') 
        try:
            r = requests.get(url, headers=self.get_param('auth_token'))
            r.raise_for_status()
            return r.json()
        except requests.exceptions.HTTPError as e:
            print(f'  [   ERROR: {r.text} ]')
            raise e

    def __request_post_wrapper(self, url, data):
        print(f'  [ POST: {url} $ data {data}]')
        try:
            r = requests.post(url, data=data, headers=self.get_param('auth_token'))
            r.raise_for_status()
        except requests.exceptions.HTTPError as e:
            print(f'  [   ERROR: {r.text} ]')
            raise e
        except requests.exceptions.ConnectionError as e:
            print('Error trying to establish a connection to API', file=sys.stderr)
            raise e
        return r.json()

    def post_user(self, username):
        url = 'http://localhost:3000/users/'
        data = {
            'username': username,
            'firstName': f'{username}-fn',
            'lastName': f'{username}-ln',
            'profileUrl': f'{username}-pu',
            'email': f'{username}@email.com',
            'photoUrl': f'{username}-pu'
        }
        user = []
        try:
            user = self.__request_post_wrapper(url, data)
        except requests.exceptions.HTTPError as e:
            user = self.__request_get_wrapper(f'{url}{data["username"]}')
        return user

    def post_room(self, room_name, owner_id):
        """ Post a new room via room name and owner id """

        url = 'http://localhost:3000/room/'
        data = {
            'roomName': room_name,
            'ownerId': owner_id
        }
        room = []
        try:
            room = self.__request_post_wrapper(url, data)
        except requests.exceptions.HTTPError as e:
            room = self.__request_get_wrapper(f'{url}{data["roomName"]}')
        return room

    def post_role(self, role_name):
        """ Post a new role via role name """

        url = 'http://localhost:3000/roles/';
        try:
            role = self.__request_post_wrapper(url, { 'role': role_name })
        except requests.exceptions.HTTPError:
            role = self.__request_get_wrapper(f'{url}{role_name}')
        return role

    def post_user_room(self, room_id, user_id):
        url = f'http://localhost:3000/user_room/'
        data = {
            'userId': user_id,
            'roomId': room_id
        }
        try:
            user_room = self.__request_post_wrapper(url, data)
        except requests.exceptions.HTTPError:
            user_room = self.__request_get_wrapper(f'{url}users/{user_id}/rooms/{room_id}')
        return user_room

    def post_user_room_role(self, room_id, user_id, role_id):
        url = 'http://localhost:3000/user_room_roles/'
        data = { 'roomId': room_id, 'userId': user_id, 'roleId': role_id }
        try:
            user_room_role = self.__request_post_wrapper(url, data)
        except requests.exceptions.HTTPError:
            url = f'{url}users/{user_id}/rooms/{room_id}/roles/{role_id}'
            user_room_role = self.__request_get_wrapper(url)
        return user_room_role


    def __seed_db(self):
        #self.set_param('users', [ self.post_user(u) for u in ['bob', 'tim', 'eric']])
        #self.set_param('rooms', [ self.post_room(r, self.users[0]['id']) for r in ['room_1', 'room_2', 'room_3']])
        self.set_param('roles', [ self.post_role('administrator') ])