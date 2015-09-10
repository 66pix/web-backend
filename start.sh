#!/bin/bash
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

if [ "$NODE_ENV" == "development" ]; then
    npm run development
else
    npm start
fi

