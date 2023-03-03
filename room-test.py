import sys
import requests
import os
from dotenv import load_dotenv
# TEMPORAL, ESTO TIENE QUE IMPLEMENTARSE EN LA BATERIA DE E2E EN JEST


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
        except requests.ConnectionError as e:
            print('Error trying to establish a connection to API', file=sys.stderr)
            raise 'FATAL'
        except requests.HTTPError as e:
            print(f'Caught exception: {str(e)}')
            raise 'FATAL'
        token = r.json()['accessToken']
        self.set_param('auth_token', { 'Authorization': f'Bearer {token}' })

    def __request_get_wrapper(self, url, id):
        pass

    def __request_post_wrapper(self, url, data):
        try:
            r = requests.post(url, data=data, headers=self.get_param('auth_token'))
            r.raise_for_status()
        except requests.exceptions.ConnectionError as e:
            print('Error trying to establish a connection to API', file=sys.stderr)
            raise e
        return r.json()

    def __post_user(self, username):
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
            print(f'[ logging HTTP error... ] {r.json()}', file=sys.stderr)
            user = self.__request_get_wrapper(url, data['username'])
        return user

    def __post_room(self, room_name, owner_id):
        url = 'http://localhost:3000/room/'
        data = {
            'roomName': room_name,
            'ownerId': owner_id
        }
        return self.__request_post_wrapper(url, data)

    def __post_role(self, role_name):
        """ Set up administrator role """

        url = 'http://localhosst:3000/roles/';
        return self.__request_post_wrapper(url, { 'role': role_name })

    def __post_user_room(self, room_id, user_id):
        url = 'http://localhost:3000/user_room'
        data = {
            'userId': user_id,
            'roomId': room_id
        }
        return self.__request_post_wrapper(url, data)

    def __post_user_room_role(self, room_id, user_id, role_id):
        url = 'http://localhost:3000/user_room_roles'
        data = { 'roomId': room_id, 'userId': user_id, 'roleId': role_id }
        return self.__request_post_wrapper(url, data)


    def __seed_db(self):
        self.set_param('users', [ self.__post_user(u) for u in ['bob', 'tim', 'eric']])
        self.set_param('rooms', [ self.__post_room(r, self.users[0]['id']) for r in ['room-1', 'room-2', 'room-3']])
        self.set_param('roles', [ self.__post_role('admin') ])

    def put_new_owner(self):
        """
        Try the next three cases:
            Push an unregistered user as an owner
            Push a non-admin user as an owner
            Push a room admin as an owner
        """
        room_id = self.get_param('rooms')[0]['id']
        user_id = self.users[1]['id']
        role_id = self.roles[0]['id']
        url = f'http://localhost:3000/room/{room_id}/owner/{user_id}'

        print('[ Unregistered user as owner ]')
        try:
            r = requests.put(url, headers=self.get_param('auth_token'))
            r.raise_for_status()
            print(f'Request returned with status code {r.status_code}', file=sys.stderr)
            raise 'FAILED TEST'
        except requests.exceptions.HTTPError as e:
            print(f'Request returned: {e}')
        except requests.exceptions.ConnectionError as e:
            raise e

        print('[ Registered user as owner ]')
        self.__post_user_room(room_id, user_id)
        try:
            r = requests.put(url, headers=self.get_param('auth_token'))
            r.raise_for_status()
            print(f'Request returned with status code {r.status_code}', file=sys.stderr)
            raise 'FAILED TEST'
        except requests.exceptions.HTTPError as e:
            print(f'Request returned: {e}')
        except requests.exceptions.ConnectionError as e:
            raise e

        print('[ Admin user as owner ]')
        self.__post_user_room_role(room_id, user_id, role_id)
        try:
            r = requests.put(url, headers=self.get_param('auth_token'))
            r.raise_for_status()
            print(f'Request returned with status code {r.status_code}', file=sys.stderr)
        except requests.exceptions.HTTPError as e:
            print(f'Request returned: {e}')
            raise 'FAILED TEST'
        except requests.exceptions.ConnectionError as e:
            raise e
        
    def del_room_cascade_test(self):
        print('[ Delete room in cascade ]')
        room_id = self.rooms[2]['id']
        user_rooms = [ self.__post_user_room(room_id, user_id) for user_id in 
            [self.users[i]['id'] for i in len(self.users)] 
        ]
        url_get = f'http://localhost:3000/user_room/rooms/{room_id}/users'
        url_del = f'http://localhost:3000/room/{room_id}'
        try:
            print('[ posting users in room... ]')
            r = requests.get(url_get, headers=self.get_param('auth_token'))
            print(f'debuga: {r.json()}')
            assert r.json() == user_rooms, 'Bad user_room post'
            print('[ deleting room... ]')
            r = requests.delete(url_del, headers=self.get_param('auth_token'))
            print('[ querying users in room... ]')
            r = requests.get(url_get, headers=self.get_param('auth_token'))
            assert r.json() == [], 'Still users in room !?'
        except requests.exceptions.ConnectionError as e:
            raise e
        print('[ ...ok ')





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
    api = APITrans()

    print('[ STARTING TESTS... ]')
    print('[ ... ]')
    print('[ PUT NEW OWNER TESTS ]')
    api.put_new_owner()
    print('[ DEL ROOM TESTS ]')
    api.del_room_cascade_test()
    #print('[ DEL USER AS OWNER TESTS ]')
    #del_user_as_owner(auth_token)
    #print('[ DEL USER IN ROOM AS OWNER ]')
    #del_user_in_room_as_owner(auth_token)
    #print('[ REMOVE ROOM IF NO USERS ARE PRESEENT ]')


if __name__ == '__main__':
    sys.exit(main())


# user room roles

"""
put new owner test: the purpose of this test is to check and validate the new owner of the room we are trying to 
update: new owner has to be registered in the room, and has to have an administrator role
    test we are going to make: posting an user not in the room, posting a non adminn user, posting a valid user
    what we need: two users, one user_room, one role ('admin')

del room test: check if cascade has been correctly set up: add multiple user_room entities on a room,
    then delete that room and check if these entities still exist.

del user as owner: 

"""