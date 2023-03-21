from api.APITrans import APITrans
import requests
import sys

if __name__ == "__main__":
  try:
    api = APITrans()
  except:
    print('o')
    sys.exit(1)
  endpoints = [ 'users/huh', 'users/nonono', 'public/nada', 'asd123' ]
  msgs = [ requests.get(f'http://localhost:3000/{endpoint}', headers=api.get_param('auth_token')).text for endpoint in endpoints ]
  for i in range(0, len(msgs)):
    print(f'For petition to http://localhost:3000/{endpoints[i]}: ', msgs[i])
