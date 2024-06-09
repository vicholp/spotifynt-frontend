FROM node:20.11-alpine as build

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

RUN npm run build

FROM nginx:1.25

COPY --from=build /app/dist /usr/share/nginx/html
