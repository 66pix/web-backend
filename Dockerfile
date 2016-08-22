FROM nodesource/jessie:6

ARG NPM_TOKEN

ENV TZ=Pacific/Auckland
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./test-helpers/.npmrc /tmp/.npmrc
ADD package.json /tmp/package.json
# ADD npm-shrinkwrap.json /tmp/npm-shrinkwrap.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/
RUN rm -f .npmrc

# Clean up
RUN apt-get -qq autoremove -y --purge
RUN rm -rf ~/.node-gyp
RUN rm -rf ~/.npm

EXPOSE 3000

CMD /opt/app/start.sh

