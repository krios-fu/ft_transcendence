#!/bin/bash

# Before executing this script:
#   1. Activate python virtual environment.
#   2. Install with pip the packages dotenv and requests.

if [ ! "$1" ]
then
    USERNAME=test
else
    USERNAME=$1
fi

# Python files can be named using dashes (-) in the name,
# but then can only be run directly and not imported.
cp api-test.py tmp_api_test.py

python3 -c 'from tmp_api_test import get_api_token; get_api_token("'$USERNAME'")' \
        | grep -o "'accessToken': '[^']*" \
        | grep -o "[^']*$"

rm tmp_api_test.py
