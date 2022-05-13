#!/bin/bash

USAGE="usage: ./start.sh [ start | stop | purge | exec [ backend, db, pgadmin ] ]"

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

if [ "$1" = "exec" ]; then
    case $2 in
    "backend")
        echo "STARTING BACKEND NESTJS";
        ID_BACKEND=$( docker ps | grep backend | awk '{ print $1 }' );
        docker exec -it "$ID_BACKEND" sh;
        echo "STOP BACKEND NESTJS";
        exit 0
    ;;
    "db")
        echo "STARTING DATABSE POSTGRESQL";
        ID_DB=$( docker ps | grep db | awk '{ print $1 }' );
        docker exec -it "$ID_DB" sh;
        echo "STOP DATABSE POSTGRESQL";
        exit 0
    ;;
    "pgadmin")
        echo "STARTING PGADMIN";
        ID_PGADMIN=$( docker ps | grep pgadmin | awk '{ print $1 }' );
        docker exec -it "$ID_PGADMIN" sh;
        echo "STOP PGADMIN";
        exit 0
    ;;
    esac
    exit 1;
fi


echo $USAGE
exit 1
