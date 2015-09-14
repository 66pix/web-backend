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

mkdir -p coverage
node_modules/.bin/istanbul cover -x gulpfile.js --include-all-sources --report html ./node_modules/.bin/_mocha -- -w  --recursive --reporter spec

