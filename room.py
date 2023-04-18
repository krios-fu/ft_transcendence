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

    except HTTPError as e:
        print(f'{e.status}, {e.reason}', file=sys.stderr)
