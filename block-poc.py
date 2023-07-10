from api.APITrans import APITrans as Api
import requests
import json

# creamos usuario
# bloqueamos al usuario
# assertamos en query

# desbloqueamos usuario
# assertamos en query

admin = 'danrodri'
base_url = 'http://localhost:3000'
user_name = 'usor'

def clean_state(api):
    users = requests.get(base_url + '/users/',
                         headers=api.get_param('auth_token')).json()
    for u in users:
        if u['username'] == user_name:
            r = requests.delete(base_url + f'/users/{u["id"]}',
                            headers=api.get_param('auth_token'))



def GET_block(api):
    print('\t:: GETting all bans')
    r = requests.get(base_url + '/users/me/blocked/',
                     headers=api.get_param('auth_token'))
    return r.json()


def POST_block(api, user):
    print('\t:: POSTing a ban test')
    payload = {'blockReceiverId': user["id"]}
    return requests.post(base_url + '/users/me/blocked/',
                         headers=api.get_param('auth_token'),
                         data=payload)


def DEL_block(api, user_id):
    print('\t:: DELeting a ban test')
    return requests.delete(base_url + f'/users/me/blocked/{user_id}',
                           headers=api.get_param('auth_token'))


if __name__ == "__main__":
    api = Api()
    api.set_user_creds(admin)
    clean_state(api)
    user = api.post_user(user_name)

    print('\n >> [ Querying an empty banned list ] << ')
    bq = GET_block(api)
    assert len(bq) == 0, json.dumps(bq, indent=2)

    print('\n >> [ Blocking a user ] << ')
    bu = POST_block(api, user)
    assert bu.status_code == 201, bu.json()

    blocked_id = bu.json()['id']

    print('\n >> [ Querying a banned list ] << ')
    bq = GET_block(api)
    ret_blk_id = bq[0]["block"]["id"]
    assert len(bq) == 1, 'query returned not size 1'
    assert ret_blk_id == blocked_id, f'bad blocked id\n{json.dumps(bq, indent=2)}'

    print('>> [ Unblocking a user ] <<')
    ubb = DEL_block(api, user['id'])
    assert ubb.status_code == 204, ubb.json()

    print('\n >> [ Querying an empty banned list ] << ')
    bq = GET_block(api)
    assert len(bq) == 0, json.dumps(bq, indent=2)
