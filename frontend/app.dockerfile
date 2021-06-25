FROM node:16-alpine

WORKDIR /app
COPY . .
COPY ./envs/.env.example.client /app/client/.env
COPY ./envs/.env.example.server /app/server/.env
WORKDIR /app/client
RUN npm install
RUN npm run build

WORKDIR /app/server
RUN npm install

CMD ["node", "."]