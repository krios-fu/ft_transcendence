import api.APITrans
import requests

if __name__ == "__main__":
  api = new APITrans()
  msg = requests.get('http://localhost:3000/users', headers=api.get_param('auth_token')).text
  print('Got: ', msg)
