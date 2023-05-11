# --------------------- #
#   DEVELOPMENT BUILD   #
# --------------------- #

FROM node:18-alpine as dev
WORKDIR /usr/src/app
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
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN ["npm", "build"]

# ~ PROD STAGE ~
FROM nginx:1.23-alpine
COPY --from=build /usr/src/app/dist /var/www/html/
COPY ./conf/nginx.conf /etc/nginx/
COPY ./conf/ssl /etc/ssl

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g 'daemon off;"]