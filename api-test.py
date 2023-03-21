import os, requests, argparse, sys
from dotenv import load_dotenv

token_uri = 'http://localhost:3000/auth/generate'
req_uri = 'http://localhost:3000/auth/2fa/generate'
val_uri = 'http://localhost:3000/auth/2fa/validate'
cnf_uri = 'http://localhost:3000/auth/2fa/confirm'
#val_uri = 'http://localhost:3000/user/1'
#val_uri = 'http://localhost:3000/user/danrodri'

def parse_args():
    parser = argparse.ArgumentParser(prog='api test')
    parser.add_argument('USER')
    parser.add_argument('PETITION')
    return parser.parse_args()

def get_api_token(user: str):
    load_dotenv()
    fortytwo_app_id = os.getenv('FORTYTWO_APP_ID')
    fortytwo_app_secret = os.getenv('FORTYTWO_APP_SECRET')

    user_profile = {
        'username': user,
        'firstName': f'{user}-fn',
        'lastName': f'{user}-ln',
        'profileUrl': '(nil)',
        'email': f'{user}-dummyEmail@domain.com',
        'photoUrl': ''
    }

    body = {
        'userProfile': user_profile,
        'app_id': fortytwo_app_id,
        'app_secret': fortytwo_app_secret
    }
    try:
        r = requests.post(token_uri, json=body, timeout=2)
    except Exception as e:
        print(f'Caught exception in token request: {e}', file=sys.stderr)
        sys.exit(1)
    data = r.json()
    print(data)
    return data['accessToken']

if __name__ == '__main__':
    args = parse_args()
    access_token = get_api_token(args.USER)

    headers = { 'Authorization': f'Bearer {access_token}'}
    print(f'good: {headers}, {access_token}')    
    if args.PETITION == 'generate':
        r = requests.post(req_uri, headers=headers, timeout=2)
        print(f'returned: {r.content}')
    elif args.PETITION == 'validate':
        token = input('Introduce token...')
        r = requests.post(
            val_uri, 
            headers=headers,
            data={'token': token},
            timeout=2)
        print(f'returned with status code {r.status_code}')
    elif args.PETITION == 'confirm':
        token = input('Introduce token...')
        r = requests.post(
            cnf_uri,
            headers=headers,
            data={ 'token': token },
            timeout=0.5
        )
        print(f'returned with status code {r.status_code}')
        print(r.json())
    elif args.PETITION == 'test':
        r = requests.get('http://localhost:3000/users/me', headers=headers)
        print(f'returned with status code {r.status_code}')
    else:
        print('please provide a valid petition', file=sys.stderr)
        sys.exit(1)
