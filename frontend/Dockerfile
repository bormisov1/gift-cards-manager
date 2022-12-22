FROM node:14-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache --virtual .build-deps make gcc g++ python3 && \
    npm install -g http-server && \
    npm install && \
    ENV=staging VUE_APP_SERVER_URL=https://str-cosmetolog.ru/api npm run build && \
    cp dist/index.html dist/404.html && \
    npm cache clean --force && \
    apk del .build-deps

CMD [ "http-server", "dist", "-p 8080"]
