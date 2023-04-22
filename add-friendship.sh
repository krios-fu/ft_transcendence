function updateToken {
    AUTH_TOKEN=$(bash auth_token_generator.sh)
}

function getAuthHeader {
    echo "Authorization: Bearer $AUTH_TOKEN"
}

HOST=http://localhost:3000
ENDPOINT=users/me/friends

if [[ ! (-n $1) || ! ($1 -eq $1) ]]
then
    echo "Pass the id of the user that will receive the invite."
    exit 1
fi

updateToken
HTTP_STATUS_CODE=$(curl $HOST/$ENDPOINT -s \
                        -w "%{response_code}" \
                        -o /dev/null \
                        -H "$(getAuthHeader)" \
                        -H "Content-Type: application/json" \
                        -d '{
                                "receiverId":'$1'
                            }')
if [[ $HTTP_STATUS_CODE -ge 400 ]]
    then
        echo Request failed with status code: $HTTP_STATUS_CODE
        exit 1
    fi
