#!/bin/bash
set -e

# Ensure database exists
! psql --host=postgres --username=postgres -c 'CREATE DATABASE test;';

mkdir -p coverage
/srv/www/node_modules/.bin/istanbul cover /srv/www/node_modules/.bin/_mocha -- --recursive --timeout 10000 --reporter spec javascript/test/configure.js javascript/test/**/*.js
/srv/www/node_modules/.bin/istanbul report html
/srv/www/node_modules/.bin/istanbul report text-summary > coverage/text-summary.txt
/srv/www/node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95

