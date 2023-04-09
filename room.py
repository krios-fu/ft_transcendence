from api.APITrans import APITrans as Api
import requests
import sys
import os

if __name__ == "__main__":
    api = Api()
    api.post_user('flocka')
    api.post_room('flocka_room', 2)
