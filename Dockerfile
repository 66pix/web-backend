FROM node:0.12.7

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

EXPOSE 3001

ADD start.sh /usr/src/start.sh

CMD /usr/src/start.sh

