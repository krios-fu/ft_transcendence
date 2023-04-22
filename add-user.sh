#!/bin/bash

if [ ! "$1" ]
then
    echo "Pass the name of the user you want to create as the script's first argument."
    exit 1
fi

TOKEN_COMMAND="bash auth_token_generator.sh $1"

function updateToken {
    AUTH_TOKEN=$($TOKEN_COMMAND)
}

updateToken
echo $AUTH_TOKEN
