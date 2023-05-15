#!bin/bash

function updateToken {
    AUTH_TOKEN=$(bash auth_token_generator.sh)
}

function getAuthHeader {
    echo "Authorization: Bearer $AUTH_TOKEN"
}

HOST=http://localhost:3000
ENDPOINT=user_room

if [[ ! (-n $1) || ! ($1 -eq $1) || ! (-n $2) || ! ($2 -eq $2) ]]
then
    echo "Pass the userId(number) and roomId(number) as arguments, in that order."
    exit 1
fi

updateToken
HTTP_STATUS_CODE=$(curl $HOST/$ENDPOINT -s \
                        -w "%{response_code}" \
                        -o /dev/null \
                        -H "$(getAuthHeader)" \
                        -H "Content-Type: application/json" \
                        -d '{
                                "userId":"'$1'",
                                "roomId":'$2'
                            }')
if [[ $HTTP_STATUS_CODE -ge 400 ]]
    then
        echo Request failed with status code: $HTTP_STATUS_CODE
        exit 1
    fi
