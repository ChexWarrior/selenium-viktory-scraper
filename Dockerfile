FROM node:carbon
LABEL MAINTAINER aplehm@gmail.com
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENTRYPOINT ["npm", "start"]