FROM nodesource/trusty:0.12

ENV TZ=Pacific/Auckland
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update
RUN apt-get -y install nginx

RUN mkdir -p /srv/www
WORKDIR /srv/www

COPY package.json /srv/www/
RUN npm install

ADD nginx/nginx.conf /etc/nginx/nginx.conf

COPY . /srv/www

ADD start.sh /srv/www/start.sh

EXPOSE 80

CMD /srv/www/start.sh

