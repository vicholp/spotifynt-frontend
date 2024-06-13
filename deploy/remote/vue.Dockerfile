FROM node:20.11-alpine as build

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL ${VITE_BACKEND_URL}

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

RUN npm run prod

FROM nginx:1.25

COPY --from=build /app/dist /usr/share/nginx/html
