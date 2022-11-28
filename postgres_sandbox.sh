# https://postgrescheatsheet.com/ #

docker run \
    --rm \
    --name postgres-sandbox \
    -e POSTGRES_PASSWORD=admin1234 \
    -d \
    postgres

docker exec -it postgres-sandbox bash -c "psql -U postgres"
