#!/bin/bash

# Required ENV
# NPM_USERNAME
# NPM_PASSWORD
# NPM_EMAIL

set -o nounset
set -o errexit

if [ -v ${NPM_USERNAME+x} ]; then
    cp .npmrc /root/.npmrc
else
npm login <<!
$NPM_USERNAME
$NPM_PASSWORD
$NPM_EMAIL
!
fi

npm install

# Ensure database exists
! psql --host=postgres --username=postgres -c 'CREATE DATABASE test;';

export TOKEN_SECRET="TOKEN_SECRET"
export RESET_PASSWORD_TOKEN_SECRET="RESET_PASSWORD_TOKEN_SECRET"

mkdir -p coverage
/srv/www/node_modules/.bin/istanbul cover --include-all-sources -x gulpfile.js /srv/www/node_modules/.bin/_mocha -- --recursive --timeout 10000 --reporter spec test/configure.js test/**/*.js
/srv/www/node_modules/.bin/istanbul report html
/srv/www/node_modules/.bin/istanbul report text-summary > coverage/text-summary.txt

/srv/www/node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95

