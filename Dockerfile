FROM node:12-alpine as base

WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /usr/app/

RUN npm install

COPY . /usr/app

# ENV PORT=8030

EXPOSE 8030

# CMD [ "npm", "run", "start" ]
