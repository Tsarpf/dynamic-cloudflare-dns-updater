FROM node:alpine

RUN mkdir /www
ADD index.js /www
ADD package.json /www
WORKDIR /www
RUN npm install --silent

CMD ["node", "index.js"]
