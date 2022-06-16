#!/bin/bash

HOST=http://10.13.5.2:3000

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

# Need to pass a json object as third argument. The only properties
# accepted bu the rout are: nickName (string), photoUrl (string),
# doubleAuth (boolean) and status ("online", "offline", "playing").
#
# Example JSON object:
# '{"nickname":"theGreat","doubleAuth":true,"status":"playing"}'

if [ $1 = "update-user" ]
then
	if [ -n "$2" ] && [ -n "$3" ]
	then
		curl -i -s -X PATCH $HOST/users/$2 \
			-H "Authorization: Bearer $TOKEN42" \
			-H "Content-Type: application/json" \
			-d $3 | tee /dev/tty | grep -q "401 Unauthorized"
		check_invalid_token
	else
		echo "Pass a username as second argument and JSON as third argument"
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
	curl -i -s $HOST/friends -H "Authorization: Bearer $TOKEN42" \
		| tee /dev/tty | grep -q "401 Unauthorized"
	check_invalid_token
	exit
fi

if [ $1 = "post-friend" ]
then
	if [ -n "$2" ]
	then
		curl -i -s -X POST $HOST/friends/$2 \
			-H "Authorization: Bearer $TOKEN42" \
			| tee /dev/tty | grep -q "401 Unauthorized"
		check_invalid_token
	else
		echo "Pass a username as second argument"
	fi
	exit
fi

if [ $1 = "accept-friend" ]
then
	if [ -n "$2" ]
	then
		curl -i -s -X PATCH $HOST/friends/accept/$2 \
			-H "Authorization: Bearer $TOKEN42" \
			| tee /dev/tty | grep -q "401 Unauthorized"
		check_invalid_token
	else
		echo "Pass a username as second argument"
	fi
	exit
fi

if [ $1 = "refuse-friend" ]
then
	if [ -n "$2" ]
	then
		curl -i -s -X PATCH $HOST/friends/refuse/$2 \
			-H "Authorization: Bearer $TOKEN42" \
			| tee /dev/tty | grep -q "401 Unauthorized"
		check_invalid_token
	else
		echo "Pass a username as second argument"
	fi
	exit
fi
