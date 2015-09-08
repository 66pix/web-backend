#!/bin/bash

# Required ENV
# NPM_USERNAME
# NPM_PASSWORD
# NPM_EMAIL

set -o nounset
set -o errexit

npm login <<!
$NPM_USERNAME
$NPM_PASSWORD
$NPM_EMAIL
!
npm install

# Ensure database exists
# psql --host=postgres --username=postgres -c 'CREATE DATABASE test;';

mkdir -p coverage
/srv/www/node_modules/.bin/istanbul cover --include-all-sources -x gulpfile.js /srv/www/node_modules/.bin/_mocha -- --recursive --reporter spec
/srv/www/node_modules/.bin/istanbul report html
/srv/www/node_modules/.bin/istanbul report text-summary > coverage/text-summary.txt
/srv/www/node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95

