FROM node:18.18.0-slim

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 80

CMD ["yarn", "start:prod"]