#!/bin/bash

HOST=http://localhost:3000

#Check if TOKEN42 environment variable is set

if [ -z "$TOKEN42" ]
then
	echo "Missing TOKEN42 environment variable."
	exit
fi

function check_invalid_token ()
{
	if [ $? -eq 0 ]
	then
		echo -e "\n\nGet a valid TOKEN42"
	else
		echo ""
	fi
}

if [ $1 = "get-users" ]
then
	curl -i -s $HOST/users -H "Authorization: Bearer $TOKEN42" \
		| tee /dev/tty | grep -q "401 Unauthorized"
	check_invalid_token
	exit
fi

# -X POST is not necessary. POST is sent automatically when adding -d

if [ $1 = "post-user" ]
then
	if [ -n "$2" ]
	then
		curl -i -s $HOST/users/new \
			-H "Authorization: Bearer $TOKEN42" \
			-H "Content-Type: application/json" \
			-d '{
				"username":"'$2'",
				"firstName":"'$2'-firstName",
				"lastName":"'$2'-lastName",
				"profileUrl":"'$2'-profileUrl",
				"email":"'$2'@mail.com",
				"photoUrl":"'$2'-photoUrl"
				}' | tee /dev/tty | grep -q "401 Unauthorized"
			check_invalid_token
	else
		echo "Pass a username as second argument"
	fi
	exit
fi

if [ $1 = "delete-user" ]
then
	if [ -n "$2" ]
	then
		curl -i -s -X DELETE $HOST/users/$2 -H "Authorization: Bearer $TOKEN42" \
			| tee /dev/tty | grep -q "401 Unauthorized"
		check_invalid_token
	else
		echo "Pass a username as second argument"
	fi
	exit
fi

if [ $1 = "get-friends" ]
then
	curl -i -s $HOST/users/friends -H "Authorization: Bearer $TOKEN42" \
		| tee /dev/tty | grep -q "401 Unauthorized"
	check_invalid_token
	exit
fi

if [ $1 = "post-friend" ]
then
	if [ -n "$2" ]
	then
		curl -i -s $HOST/users/friends \
			-H "Authorization: Bearer $TOKEN42" \
			-H "Content-Type: application/json" \
			-d '{
				"friendId":"'$2'"
				}' | tee /dev/tty | grep -q "401 Unauthorized"
			check_invalid_token
	else
		echo "Pass a username as second argument"
	fi
	exit
fi
