#!/bin/bash
set -o nounset
set -o errexit

npm login <<!
$NPM_USERNAME
$NPM_PASSWORD
$NPM_EMAIL
!
npm install

if [ "$NODE_ENV" == "development" ]; then
    npm run development
else
    npm start
fi

