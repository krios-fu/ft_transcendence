# --------------------- #
#   DEVELOPMENT BUILD   #
# --------------------- #

FROM node:18-alpine as dev
WORKDIR /usr/src/
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 4200

CMD ["npm", "run", "start"]


# -------------------- #
#   PRODUCTION BUILD   #
# -------------------- #

# ~ BUILD STAGE ~
FROM node:18-alpine as build
WORKDIR /usr/src/
COPY package*.json ./
RUN npm install
COPY . .
RUN ["npm", "run", "build"]

# ~ PROD STAGE ~
FROM nginx:1.23-alpine as prod
COPY --from=build /usr/src/dist/web /var/www/app
COPY config/nginx.conf /etc/nginx/nginx.conf
COPY config/ssl/* /etc/ssl/

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]