FROM node:18.12-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install --force

EXPOSE 3000

CMD ["npm", "run", "start"]
