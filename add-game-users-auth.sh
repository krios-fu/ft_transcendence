#!/bin/bash

function updateToken {
    AUTH_TOKEN=$(bash auth_token_generator.sh)
}

function getAuthHeader {
    echo "Authorization: Bearer $AUTH_TOKEN"
}

function launchRequest {
    HTTP_STATUS_CODE=$(curl $HOST/$ENDPOINT -s \
                        -w "%{response_code}" \
                        -o /dev/null \
                        -H "$(getAuthHeader)" \
                        -H "Content-Type: application/json" \
                        -d '{
                                "username":"user-'$COUNTER'",
                                "firstName":"user-'$COUNTER'-firstName",
                                "lastName":"user-'$COUNTER'-lastName",
                                "profileUrl":"user-'$COUNTER'-profileUrl",
                                "email":"user-'$COUNTER'@mail.com",
                                "photoUrl":"user-'$COUNTER'-photoUrl"
                            }')
}

function handleRequestFailure {
    if [[ $HTTP_STATUS_CODE -ge 400 ]]
    then
        if [[ $RETRY_COUNTER -lt 3 ]]
        then
            let RETRY_COUNTER++
            updateToken
            launchRequest
        else
            echo Request failed with status code: $HTTP_STATUS_CODE
            exit 1
        fi
    elif [[ $RETRY_COUNTER -ne 0 ]]
    then
        let RETRY_COUNTER=0
    fi
}

HOST=http://localhost:3000
ENDPOINT=users

let COUNTER=1
let RETRY_COUNTER=0

if [[ ! (-n $1) || ! ($1 -eq $1) ]]
then
    echo "Pass the number of game users you want to create as the script's first argument."
    exit 1
fi

updateToken
while [[ $COUNTER -le $1 ]]
do
    launchRequest
    handleRequestFailure
    let COUNTER++
done
