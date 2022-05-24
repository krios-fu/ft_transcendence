#!/bin/bash

USAGE="usage: ./start.sh [ start | stop | purge ]"

if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
   echo $USAGE

   exit 0
fi

if [ "$1" = "purge" ]; then
    docker rm $(docker ps -a -q)
    docker rmi --force $(docker images -q)
    docker volume rm $(docker volume ls -q)

    exit 0
fi

if [ "$1" = "start" ]; then
    docker-compose up --build

    exit 0
fi

if [ "$1" = "stop" ]; then
    docker-compose stop

    exit 0
fi

echo $USAGE
exit 1
