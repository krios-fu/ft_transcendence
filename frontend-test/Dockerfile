FROM node:18-alpine

WORKDIR /var/www/

COPY package.json package-lock.json .

RUN npm install &&
    npm run ng build --prod

# ---

FROM nginx:alpine

COPY ./config/nginx.con /etc/nginx/nginx.conf

