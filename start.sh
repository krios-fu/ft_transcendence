#!/bin/bash

if [ "$1" = "purge" ]; then
    docker rm $(docker ps -a -q)
    docker rmi --force $(docker images -q)
    docker volume rm $(docker volume ls -q)

    exit 0;
fi

docker-compose up --build
