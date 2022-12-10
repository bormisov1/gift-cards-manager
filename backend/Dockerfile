FROM node:18.12-alpine

RUN mkdir -p /backend

WORKDIR /backend

COPY . .

RUN npm install --force

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
