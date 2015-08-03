FROM nodesource/trusty:0.12

ENV TZ=Pacific/Auckland
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /srv/www
WORKDIR /srv/www

COPY package.json /srv/www/
RUN npm install

COPY . /srv/www/

EXPOSE 3000

CMD /srv/www/start.sh

