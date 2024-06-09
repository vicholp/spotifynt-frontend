FROM node:20.11 as build

WORKDIR /app

USER 1000:1000

COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
