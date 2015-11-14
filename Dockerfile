FROM nodesource/trusty:5
ARG NPM_AUTH_TOKEN

### TODO strip these portions out when building for release
### DEVELOPMENT ###
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install postgresql gcc-4.8
### DEVELOPMENT ###

ENV TZ=Pacific/Auckland
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /srv/www
WORKDIR /srv/www

COPY package.json /srv/www/
COPY . /srv/www/

RUN rm -rf node_modules
RUN npm config set //registry.npmjs.org/:_authToken $NPM_AUTH_TOKEN
RUN npm install
RUN rm ~/.npmrc

EXPOSE 3000

CMD /srv/www/start.sh

