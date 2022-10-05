#/bin/bash

host='localhost:3000'

if [ $# -eq 0 ]; then
    echo 'bad arg' 1>&2
    exit 1
fi;

function ban_opt() {
    case $2 in
        "getall")   curl -v $host/$1 ;;
        "get")      curl -v $host/$1/$3 ;;
        "getrooms") curl -v $host/$1/rooms/$3 ;;
        "getusers") curl -v $host/$1/users/$3 ;;
        "post")     curl -v -X POST   $host/$1 --data '{"userId":"'$3'","roomId":"'$4'"}' ;;
        "del")      curl -v -X DELETE $host/$1/$3 ;;
        *)          echo "BAD (ban) ~$1~" ;;
    esac 
}

function user_opt() {
    case $2 in
        "getall") curl -v $host/$1s ;;
        "get")    curl -v $host/$1s/$3 ;;
        "post")   curl -v -X POST   $host/$1s/new --data '{"username":"'$3'","firstName":"'$3'-fn","lastName":"'$3'-ln",\
                                            "profileUrl":"'$3'-pu","email":"'$3'-email","photoUrl":"'$3'-ph"}' ;;
        "patch")  curl -v -X PATCH  $host/$1s/$3 ;; # ~~ tbc ~~ 
        "del")    curl -v -X DELETE $host/$1s/$3 ;;
        *)        echo "BAD (user)" ;;
    esac
}

# function room_opt() {}

# function roles_opt() {}

# function room_roles_opt() {}

# function user_roles_opt() {}

# function user_rooms_opt() {}

# function user_room_roles_opt() {}

case $1 in 
    "help"|"-h") echo 'read the script'; exit 1 ;;
    "ban")       ban_opt "$@";;
    "user")      user_opt "$@";;
    #"room")      room_opt "$@" ;;
    #"roles")      roles_opt "$@" ;;
    #"room_roles")      room_roles_opt "$@" ;;
    #"user_roles")      user_roles_opt "$@" ;;
    #"user_rooms")      user_rooms_opt "$@" ;;
    #"user_room_roles")      user_room_roles_opt "$@" ;;

    *)     echo 'BAD' ;;
esac