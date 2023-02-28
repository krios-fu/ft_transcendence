import sys
import requests
from requests import HTTPError
import os
from dotenv import load_dotenv
# TEMPORAL, ESTO TIENE QUE IMPLEMENTARSE EN LA BATERIA DE E2E EN JEST


class APITrans():
    def __init__(self, *args, **kwargs):
        load_dotenv()
        for key, value in kwargs.items():
            self.__setattr__(key, value))
            api_id = os.getenv('FORTYTWO_APP_ID')
            api_secret = os.getenv('FORTYTWO_APP_SECRET')
            if api_id == None or api_secret == None:
                raise Exception('api credentials were not provided')
            self.__setattr__('api_id', api_id)
            self.__setattr__('api_secret', api_secret)
            self.__get_creds('admin')
            self.__seed_db()

    def __setattr__(self, key, value):
        self.__dict__[key] = value

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
            'app_id': self.__getitem__('api_id'),
            'app_secret': self.__getitem__('api_secret')
        }
        token_url = 'http://localhost:3000/auth/generate'
        try:
            r = requests.post(token_url, json=token_creds, timeout=0.2)
            r.raise_for_status()
        except requests.ConnectionError as e:
            print('Error trying to establish a connection to API', file=sys.stderr)
            raise e
        except requests.HTTPError as e:
            print(f'Caught exception: {str(e)}')
            raise e
        token = r.json()['accessToken']
        self.__setattr__('auth_token', { 'Authentication': f'Bearer: {token}' })

    def __post_user(self, username):
        url = 'http://localhost:3000/user'
        data = {
            'username': username,
            'firstName': f'{username}-fn',
            'lastName': f'{username}-ln',
            'profileUrl': f'{username}-pu',
            'email': f'{username}-e',
            'photoUrl': f'{username}-pu'
        }
        try:
            r = requests.post(url, data=data, headers=self.__getitem__('auth_token'))
            r.raise_for_status()
        except requests.ConnectionError as e:
            print('Error trying to establish a connection to API', file=sys.stderr)
            raise e
        except requests.HTTPError as e:
            print(f'Caught exception: {str(e)}')
            raise e
        return r.json()

    def __post_room(self, roomname, owner_id):
        url = 'http://localhost:3000/room'
        data = {
            'roomName': roomname,
            'ownerId': owner_id
        }
        try:
            r = requests.post(url, data=data, headers=self.__getitem__('auth_token'))
            r.raise_for_status()
        except requests.ConnectionError as e:
            print('Error trying to establish a connection to API', file=sys.stderr)
            raise e
        except requests.HTTPError as e:
            print(f'Caught exception: {str(e)}')
            raise e
        return r.json()

    def __post_room(self, roomname, owner_id):
        url = 'http://localhost:3000/room'
        data = {
            'roomName': roomname,
            'ownerId': owner_id
        }
        try:
            r = requests.post(url, data=data, headers=self.__getitem__('auth_token'))
            r.raise_for_status()
        except requests.ConnectionError as e:
            print('Error trying to establish a connection to API', file=sys.stderr)
            raise e
        except requests.HTTPError as e:
            print(f'Caught exception: {str(e)}')
            raise e
        return r.json()


    def __post_role(self, rolename):
        """ Set up administrator role """

        url = 'http://localhosst:3000/roles';
        try:
            r = requests.post(url, data={ 'role': rolename }, headers=self.__getitem__('auth_token'))
            r.raise_for_status()
        except requests.ConnectionError as e:
            print('Error trying to establish a connection to API', file=sys.stderr)
            raise e
        except requests.HTTPError as e:
            print(f'Caught exception: {str(e)}')
            raise e
        return r.json()


    def __seed_db(self):
        users = [ self.__post_user(u) for u in ['bob', 'tim', 'eric']]
        rooms = [ self.__post_room(r, i) for r in ['room-1', 'room-2', 'room-3'] for i in users[0]['id']]
        role = self.__post_role('admin')


    def __post_user_room(room_id, user_id, auth_token):
        url = 'http://localhost:3000/user_room'
        headers = auth_token
        data = {
            'userId': user_id,
            'roomId': room_id
        }
        try:
            r = requests.post(url, headers=headers, data=data)
            r.raise_for_status()
        except HTTPError:
            print('Error trying to post a user_room')
            sys.exit(1)

    def __post_user_room_role(room_id, )


def put_new_owner(auth_token):
    """
    Try the next three cases:
        Push an unregistered user as an owner
        Push a non-admin user as an owner
        Push a room admin as an owner
    """
    print('[ Unregistered user as owner ]')


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


# user room roles

"""
put new owner test: the purpose of this test is to check and validate the new owner of the room we are trying to 
update: new owner has to be registered in the room, and has to have an administrator role
    test we are going to make: posting an user not in the room, posting a non adminn user, posting a valid user
    what we need: two users, one user_room, one role ('admin')

del room test: check if cascade has been correctly set up: add multiple user_room entities on a room,
    then delete that room and check if these entities still exist.


"""