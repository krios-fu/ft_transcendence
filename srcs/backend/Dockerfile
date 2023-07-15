# --------------------- #
#   DEVELOPMENT BUILD   #
# --------------------- #

FROM node:18-alpine as dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN ["npm", "run", "build"]

# ----------------- #
#   TESTING BUILD   #
# ----------------- #

FROM dev as testing

COPY test .

CMD ["npm", "run", "test:e2e"]

# -------------------- #
#   PRODUCTION BUILD   #
# -------------------- #

FROM node:18-alpine as prod

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev \
    && npm cache clean --force

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
