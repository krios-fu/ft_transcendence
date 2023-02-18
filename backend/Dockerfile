FROM node:18-alpine as dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine as testing

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

CMD ["npm", "run test:e2e --config ./test/jest-e2e.json"]

FROM node:18-alpine as prod

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev \
    && npm cache clean --force

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
