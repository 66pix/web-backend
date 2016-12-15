FROM node:7

ENV TZ=Pacific/Auckland
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /srv/www
WORKDIR /srv/www

# Copy application files and dependencies
# It is assumed that node_modules has been setup previously
COPY package.json /srv/www/
COPY . /srv/www/

# Rebuild/install node dependencies
RUN npm rebuild

# Clean up
RUN rm -rf /srv/www/node_modules/.git
RUN apt-get -qq autoremove -y --purge
RUN rm -rf ~/.node-gyp
RUN rm -rf ~/.npm

EXPOSE 3000

CMD /srv/www/start.sh

