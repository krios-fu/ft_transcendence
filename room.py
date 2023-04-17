from api.APITrans import APITrans as Api
from requests.exceptions import HTTPError
import sys
import os

if __name__ == "__main__":
    api = Api()
    try:
        api.post_user('flocka')
        api.post_room('flocka_room', 2)
    except HTTPError as e:
        print(f'{e.status_code}, {e.reason}', file=sys.stderr)
