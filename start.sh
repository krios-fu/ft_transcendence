#!/bin/bash

if [ "$1" = "purge" ]; then
    docker rm $(docker ps -a -q)
    docker rmi --force $(docker images -q)
    docker volume rm $(docker volume ls -q)
else
    if [ "$1" = "start" ]; then
        docker-compose up --build 
        else
             if [ "$1" = "stop" ]; then
                docker-compose stop
             fi
    fi
    exit 0;
fi
