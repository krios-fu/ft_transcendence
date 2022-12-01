#!/bin/bash

HOST=http://localhost:3000
let COUNTER=1

if [[ ! (-n $1) || ! ($1 -eq $1) ]]
then
    echo "Pass the number of game users you want to create as the script's first argument."
    exit 1
fi

while [[ $COUNTER -le $1 ]]
do
    curl -s $HOST/users \
            -H "Content-Type: application/json" \
            -d '{
                "username":"user-'$COUNTER'",
                "firstName":"user-'$COUNTER'-firstName",
                "lastName":"user-'$COUNTER'-lastName",
                "profileUrl":"user-'$COUNTER'-profileUrl",
                "email":"user-'$COUNTER'@mail.com",
                "photoUrl":"user-'$COUNTER'-photoUrl"
                }'
    let COUNTER++
done
