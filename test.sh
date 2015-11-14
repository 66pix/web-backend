#!/bin/bash
set -e

./npm-login.sh

rm -rf node_modules
npm install

# Ensure database exists
! psql --host=postgres --username=postgres -c 'CREATE DATABASE test;';

export TOKEN_SECRET="TOKEN_SECRET"
export RESET_PASSWORD_TOKEN_SECRET="RESET_PASSWORD_TOKEN_SECRET"

mkdir -p coverage
/srv/www/node_modules/.bin/istanbul cover --include-all-sources /srv/www/node_modules/.bin/_mocha -- --recursive --timeout 10000 --reporter spec
/srv/www/node_modules/.bin/istanbul report html
/srv/www/node_modules/.bin/istanbul report text-summary > coverage/text-summary.txt

echo "\n"

/srv/www/node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95

