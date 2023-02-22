import sys
# TEMPORAL, ESTO TIENE QUE IMPLEMENTARSE EN LA BATERIA DE E2E EN JEST


def generate_credentials():
    pass

def del_room_cascade_test(auth_token):
    # generate new users
    # generate new room
    # generate users in room
    # delete room
    # query users in deleted room
    pass

def put_new_owner(auth_token):
    pass

def del_user_as_owner(auth_token):
    pass

def del_user_in_room_as_owner(auth_token):
    pass

def main():
   # get token
    auth_token = generate_credentials()

    print('[ STARTING TESTS... ]')
    print('[ ... ]')
    print('[ PUT NEW OWNER TESTS ]')
    put_new_owner(auth_token)
    print('[ DEL ROOM TESTS ]')
    del_room_cascade_test(auth_token)
    print('[ DEL USER AS OWNER TESTS ]')
    del_user_as_owner(auth_token)
    print('[ DEL USER IN ROOM AS OWNER ]')
    del_user_in_room_as_owner(auth_token)
    print('[ REMOVE ROOM IF NO USERS ARE PRESEENT ]')


if __name__ == '__main__':
    sys.exit(main())