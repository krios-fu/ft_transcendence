from api.APITrans import APITrans as Api
import requests
import sys

# compromabos roles de sala: { official, private }
# comprobamos roles de usuario: { owner, admin }
# comprobamos roles en sala: { room owner, room admin }
# y comprobamos la interacción entre estos roles
if __name__ == "__main__":
    api = Api()

    users = [ api.post_user(uname) for uname in ['user', 'owner', 'admin', 'room_owner', 'room_admin'] ]
    roles = [ api.post_role(role) for role in ['private', 'official', 'owner', 'admin'] ]
    rooms = [ api.post_room(room, users[3]['id']) for room in ['private_room', 'official_room'] ]

    owner = api.post_user_role(users[1]['id'], roles[2]['id'])
    admin = api.post_user_role(users[2]['id'], roles[3]['id'])
    room_admin = api.post_user_room_role(rooms[0]['id'], users[4]['id'], roles[3])

    private_room = api.post_room_role(rooms[0]['id'], roles[0]['id'])
    official_room = api.post_room_role(rooms[1]['id'], roles[0]['id'])

    # *** POST room_roles == private *** 

 #   post_results = [ api.post_room_role]
    # *** DEL room_roles

#    del_re
