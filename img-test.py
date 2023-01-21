import sys, requests, argparse, os, mimetypes, json
from dotenv import load_dotenv
from pygments import highlight, lexers, formatters

token_url = 'http://localhost:3000/auth/generate'
avatar_url = 'http://localhost:3000/users/me/avatar'

avatar_path = './default-avatar.jpeg'

def parse_arguments():
    parser = argparse.ArgumentParser(prog='img-test')
    parser.add_argument('USER')
    parser.add_argument('OPTION',
        choices={'post', 'postr', 'del', 'delr', 'delroom', 'deluser'})
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

def post_avatar(auth_header: str):
    content = mimetypes.guess_type(avatar_path)
    files = { 'avatar': ('avatar.jpeg', open(avatar_path, 'rb'), content[0], {'Expires': 0}) }
    return requests.post(avatar_url, files=files, headers=auth_header)

def post_avatar_room(auth_header: str):
    id = input('input room id...')
    content = mimetypes.guess_type(avatar_path)
    files = { 'avatar': ('avatar.jpeg', open(avatar_path, 'rb'), content[0], {'Expires': 0}) }
    return requests.post(f'http://localhost:3000/room/{id}/avatar',
        files=files, headers=auth_header)

def del_avatar(auth_header: str):
    return requests.delete(avatar_url, headers=auth_header)

def del_avatar_room(auth_header: str):
    id = input('input room id...')
    return requests.delete(f'http://localhost:3000/room/{id}/avatar',
        headers=auth_header)

def del_room(auth_header: str):
    id = input('input room id...')
    return requests.delete(f'http://localhost:3000/room/{id}',
        headers=auth_header)

def del_user(auth_header: str):
    id = get_me(auth_header)
    return requests.delete(f'http://localhost:3000/users/{id}',
        headers=auth_header)

def get_me(auth_header: str):
    res = requests.get('http://localhost:3000/users/me',
        headers=auth_header)
    #print(f'json: {r.json()}')
    print(highlight(
        json.dumps(res.json(), indent=2),
        lexers.JsonLexer(),
        formatters.TerminalFormatter()))
    body = res.json()[0]
    return body['id']

test_opts = {
    'post': post_avatar,
    'postr': post_avatar_room,
    'del': del_avatar,
    'delr': del_avatar_room,
    'delroom': del_room,
    'deluser': del_user
}

def main():
    args = parse_arguments()
    try:
        access_token = get_auth_headers(args.USER)
        auth_header = { 'Authorization': f'Bearer {access_token}' }
        res = test_opts[args.OPTION](auth_header)

        if res.content:
            print(highlight(
                json.dumps(res.json(), indent=2),
                lexers.JsonLexer(),
                formatters.TerminalFormatter()))
        print('[ x ] Request successfully done!')
    except Exception as e:
        print(f'ded: {e}', file=sys.stderr)
        raise e

    #post_avatar(access_token)
    #id = get_me(access_token)
    #r = requests.delete(f'http://localhost:3000/users/{id}',
    #    headers={'Authorization': f'Bearer {access_token}'}
    #)
    #print(f'response: {r.json()}')
    #del_avatar(access_token)
    #get_me(access_token)

if __name__ == '__main__':
    sys.exit(main())

# TODO:
# OPTIONS: post_avatar, post_avatar_room, remove_avatar, remove_avatar_room, remove_room, remove_user
