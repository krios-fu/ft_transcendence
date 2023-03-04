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
        except requests.exceptions.ConnectionError as e:
            print('Error trying to establish a connection to API', file=sys.stderr)
            raise 'FATAL'
        except requests.HTTPError as e:
            print(f'Caught exception: {str(e)}')
            raise e
        token = r.json()['accessToken']
        self.set_param('auth_token', { 'Authorization': f'Bearer {token}' })

    def __request_get_wrapper(self, url):
        """ Requests entity detail view via ID. """
        try:
            print(f'[ request to {url} ]')
            r = requests.get(url, headers=self.get_param('auth_token'))
            r.raise_for_status()
            return r.json()
        except requests.exceptions.HTTPError as e:
            print(f'[ logging exception ] {e}', file=sys.stderr)
            raise e

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
            user = self.__request_get_wrapper(f'{url}{data["username"]}')
        return user

    def __post_room(self, room_name, owner_id):
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

    def __post_role(self, role_name):
        """ Set up administrator role """

        url = 'http://localhost:3000/roles/';
        try:
            role = self.__request_post_wrapper(url, { 'role': role_name })
        except requests.exceptions.HTTPError:
            role = self.__request_get_wrapper(url, role_name)
        return role

    def __post_user_room(self, room_id, user_id):
        url = 'http://localhost:3000/user_room/'
        data = {
            'userId': user_id,
            'roomId': room_id
        }
        try:
            user_room = self.__request_post_wrapper(url, data)
        except requests.exceptions.HTTPError:
            user_room = self.__request_get_wrapper(f'{url}?filter[userId]={user_id}&filter[roomId]={room_id}')
        return user_room

    def __post_user_room_role(self, room_id, user_id, role_id):
        url = 'http://localhost:3000/user_room_roles'
        data = { 'roomId': room_id, 'userId': user_id, 'roleId': role_id }
        try:
            user_room_role = self.__request_post_wrapper(url, data)
        except requests.exceptions.HTTPError:
            url = f'{url}?filter[userId]={user_id}&filter[roomId]={room_id}&filter[roleId]={role_id}'
            user_room_role = self.__request_get_wrapper(url, headers=self.get_param('auth_token'))
        return user_room_role


    def __seed_db(self):
        self.set_param('users', [ self.__post_user(u) for u in ['bob', 'tim', 'eric']])
        self.set_param('rooms', [ self.__post_room(r, self.users[0]['id']) for r in ['room_1', 'room_2', 'room_3']])
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

        print('[ TEST: Unregistered user as owner ]')
        try:
            r = requests.put(url, headers=self.get_param('auth_token'))
            r.raise_for_status()
            print(f'Request returned with status code {r.status_code}', file=sys.stderr)
            raise 'FAILED TEST'
        except requests.exceptions.HTTPError as e:
            print(f'Request returned: {e}')
        except requests.exceptions.ConnectionError as e:
            raise e
        

        print('[ TEST: Registered user as owner ]')
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
        print('[ ...ok ]')



    def del_user_as_owner(self):
        user = self.__post_user('del_user')
        rooms = [self.__post_room(room_id, user['id']) for room_id in ['room_del_user_1', 'room_del_user_2', 'room_del_user_2']]

        print('[ Query room for users in first room (should be owner) ]')
        try: 
            url = f'http://localhost:3000/user_room/room/{rooms[0]["id"]}/users'
            r = requests.get(url, headers=self.get_param('auth_token'))
            r.raise_for_status()
            print(f'[ Query results ] {r.text}')
        except requests.exceptions.HTTPError as e:
            print(f'[ logging HTTP exception... ] {str(e)}', file=sys.stderr)
            raise e
        
        # remove user
        try:
            user_id = user['id']
            url = f'http://localhost:3000/users/{user_id}'
            r = requests.delete(url, headers=self.get_param('auth_token'))
            r.raise_for_status()
        except requests.exceptions.HTTPError as e:
            print(f'[ logging HTTP exception... ] {str(e)}', file=sys.stderr)
            raise e

        # query room, check owner
        responses = [ self.__request_get_wrapper() for room_id in r['id'] for r in rooms ]
        

    def del_user_in_room_as_owner(self):
        # put user in room
        # make user owner
        # remove user in room
        # query room, check owner
        pass


def main():
    # get token
    api = APITrans()

    api.put_new_owner()
    api.del_room_cascade_test()
    #api.del_user_as_owner()
    #print('[ DEL USER IN ROOM AS OWNER ]')
    #del_user_in_room_as_owner(auth_token)
    #print('[ REMOVE ROOM IF NO USERS ARE PRESEENT ]')


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