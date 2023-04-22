from api.APITrans import APITrans as Api
from requests.exceptions import HTTPError
import sys

if __name__ == "__main__":
    api = Api()
    try:
        api.post_user('admin')
        api.post_room('public_room', 2)
        room = api.post_room('private_room', 1)
        role = api.post_role('private')
        room_role = api.post_room_role(room['id'], role['id'])
        TEST_list_registered_users(api)

    except HTTPError as e:
        print(f'{e.status}, {e.reason}', file=sys.stderr)


def TEST_list_registered_users(api):
    users = ['user1', 'user2', 'user3', 'user4'].map(lambda u: api.post_user(u))
    user_rooms = [ api.post_user_room(user['id'], room['id']) for user in users ] 
