import sys, requests, argparse, os, mimetypes
from dotenv import load_dotenv

token_url = 'http://localhost:3000/auth/generate'
avatar_url = 'http://localhost:3000/users/me/avatar'

avatar_path = './default-avatar.jpeg'


def parse_arguments():
    parser = argparse.ArgumentParser(prog='img-test')
    parser.add_argument('USER')
    return parser.parse_args()


def get_auth_headers(user: str):
    # get env variables
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

    # can we generate a token for an already existing user??
    return r.json()['accessToken']

def post_avatar(access_token: str):
    """ with open(avatar_path, 'rb+') as f:
        img = f.read()
     """
    content = mimetypes.guess_type(avatar_path)
    print(content[0])
    files = { 'avatar': ('avatar.jpeg', open(avatar_path, 'rb'), content[0], {'Expires': 0}) }
    print(f'files: {files}')
    headers = { 'Authorization': f'Bearer {access_token}' }
    r = requests.post(avatar_url, files=files, headers=headers)
    print(f'response: {r.json()}')

# def del_avatar():
#
#
#

def main():
    args = parse_arguments()
    access_token = get_auth_headers(args.USER)

    print(f'access_token: {access_token}')
#    r = requests.post()
    post_avatar(access_token)

if __name__ == '__main__':
    sys.exit(main())



# create user and post credentials
#   post valid avatar
#   post valid avatar in wrong body format
#   post without avatar
#   post invalid file
#   post invalid file with .jpg ext

#   remove avatar
#   remove avatar with no avatar
