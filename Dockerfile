FROM nodesource/jessie:5

ARG NPM_AUTH_TOKEN
ARG NPM_INSTALL_FLAGS

ENV TZ=Pacific/Auckland
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /srv/www
WORKDIR /srv/www

COPY package.json /srv/www/
COPY . /srv/www/

RUN rm -rf node_modules
RUN npm config set loglevel silent
RUN npm config set //registry.npmjs.org/:_authToken $NPM_AUTH_TOKEN
RUN npm install $NPM_INSTALL_FLAGS

RUN apt-get autoremove -y --purge
RUN rm ~/.npmrc
RUN rm -rf ~/.node-gyp
RUN rm -rf ~/.npm

EXPOSE 3000

CMD /srv/www/start.sh

