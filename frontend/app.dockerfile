FROM node:16-alpine

RUN apk add --no-cache python3 g++ make && ln -sf python3 /usr/bin/python

WORKDIR /app
COPY . .
RUN nmp install --unsadfe-perm node-sass
RUN yarn install --prodaction
RUN npm run build

CMD ["node", "./server"]