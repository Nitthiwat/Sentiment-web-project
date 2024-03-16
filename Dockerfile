FROM node:18

WORKDIR /app

COPY . /app

RUN npm ci

RUN npm run build

EXPOSE 8080

CMD [ "npx", "server", "dist" ]