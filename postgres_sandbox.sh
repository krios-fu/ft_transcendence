# https://postgrescheatsheet.com/ #

docker run \
    --rm \
    --name postgres-sandbox \
    -e POSTGRES_PASSWORD=admin1234 \
    -d \
    postgres

docker exec -u postgres -it postgres-sandbox psql