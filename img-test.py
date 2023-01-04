import sys, requests, argparse, os, mimetypes
from dotenv import load_dotenv

token_url = 'http://localhost:3000/auth/generate'
avatar_url = 'http://localhost:3000/users/me/avatar'

room_url = 'http://localhost:3000/room/1/avatar'

avatar_path = './default-avatar.jpeg'


def parse_arguments():
    parser = argparse.ArgumentParser(prog='img-test')
    parser.add_argument('USER')
    return parser.parse_args()


def get_auth_headers(user: str):
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
    r = requests.post(token_url, json=token_creds, timeout=0.2)
    return r.json()['accessToken']

def post_avatar(access_token: str):
    content = mimetypes.guess_type(avatar_path)
    files = { 'avatar': ('avatar.jpeg', open(avatar_path, 'rb'), content[0], {'Expires': 0}) }
    headers = { 'Authorization': f'Bearer {access_token}' }
    r = requests.post(avatar_url, files=files, headers=headers)
    print(f'response: {r.json()}')

def del_avatar(access_token: str):
    headers = { 'Authorization': f'Bearer {access_token}' }
    r = requests.delete(avatar_url, headers=headers)
    print(f'response: {r.json()}')

def get_me(access_token: str):
    r = requests.get(
        'http://localhost:3000/users/me',
        headers={ 'Authorization': f'Bearer {access_token}' }
    )
    print(f'json: {r.json()}')
    return r.json()['id']

def main():
    args = parse_arguments()
    access_token = get_auth_headers(args.USER)

    print(f'access_token: {access_token}')
    post_avatar(access_token)
    id = get_me(access_token)
    r = requests.delete(f'http://localhost:3000/users/{id}',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    print(f'response: {r.json()}')
    #del_avatar(access_token)
    #get_me(access_token)

if __name__ == '__main__':
    sys.exit(main())

# TODO:
# OPTIONS: post_avatar, post_avatar_room, remove_avatar, remove_avatar_room, remove_room, remove_user
