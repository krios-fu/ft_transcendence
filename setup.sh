#!/bin/bash

set -euf

usage="usage: $(basename "$0") [up | down | prune | exec [backend | db | pgadmin | frontend]]"

case $1 in
    "--help"|"-h") echo "$usage" ;;
    "up")
        case $2 in
            "--prod") COMPOSE_HTTP_TIMEOUT=200 docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up --build ;;
            "--test") docker-compose -f docker-compose.yaml -f docker-compose.test.yaml up --build ;;
            * | "--dev") COMPOSE_HTTP_TIMEOUT=200 docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build ;;
        esac ;;
    "down")
        docker-compose down ;;
    "prune")
        docker-compose down
        docker system prune --all ;;
    "exec")
        case $2 in
        "backend")
            echo "STARTING BACKEND NESTJS";
            ID_BACKEND=$( docker ps | grep backend | awk '{ print $1 }' );
            docker exec -it "$ID_BACKEND" sh;
            echo "EXIT CONTAINER  BACKEND NESTJS"; ;;
        "db")
            echo "STARTING DATABSE POSTGRESQL";
            ID_DB=$( docker ps | grep db | awk '{ print $1 }' );
            docker exec -it "$ID_DB" sh;
            echo "EXIT CONTAINER DATABSE POSTGRESQL"; ;;
        "pgadmin")
            echo "STARTING PGADMIN";
            ID_PGADMIN=$( docker ps | grep pgadmin | awk '{ print $1 }' );
            docker exec -it "$ID_PGADMIN" sh;
            echo "EXIT CONTAINER  PGADMIN"; ;;
        "frontend")
            echo "STARTING FRONTEND";
            ID_FRONTEND=$( docker ps | grep frontend | awk '{ print $1 }' );
            docker exec -it "$ID_FRONTEND" sh;
            echo "EXIT CONTAINER FRONTEND ANGULAR"; ;;
        *)
            echo $usage
            exit 1 ;;
        esac ;;
    *)
        echo -e $usage
        exit 1 ;;
esac
