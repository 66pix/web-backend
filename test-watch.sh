#!/bin/bash

usage()
{
cat << EOF
usage: $0 options

This script runs tests and watch for changes

OPTIONS:
   -u      postgres database user (defaults to "postgres")
   -h      postgres host (defaults to "postgres")
   -s      token secret (defaults to TOKEN_SECRET environment variable)
   -d      debug string (defaults to "") use "*" to output verbose debug information
EOF
}

DATABASE_USERNAME=
DATABASE_HOST=
TOKEN_SECRET="TOKEN_SECRET"
RESET_PASSWORD_TOKEN_SECRET="RESET_PASSWORD_TOKEN_SECRET"
DEBUG=
while getopts "u:h:d:s:" OPTION
do
     case $OPTION in
         h)
             DATABASE_HOST=$OPTARG
             ;;
         u)
             DATABASE_USERNAME=$OPTARG
             ;;
         d)
             DEBUG=$OPTARG
             ;;
         s)
             TOKEN_SECRET=$OPTARG
             ;;
         ?)
             usage
             exit
             ;;
     esac
done

export NODE_ENV="development"

if [ -z $POSTGRES ]; then
    export POSTGRES="postgres://$DATABASE_USERNAME@$DATABASE_HOST/test"
fi

if [ -z $DATABASE_USERNAME ]; then
    DATABASE_USERNAME="postgres"
fi

if [ -z $DATABASE_HOST ]; then
    DATABASE_HOST="postgres"
fi

if [ ! -z $TOKEN_SECRET ]; then
    export TOKEN_SECRET=$TOKEN_SECRET
    export RESET_PASSWORD_TOKEN_SECRET=$TOKEN_SECRET
fi

if [ ! -z $DEBUG ]; then
    export DEBUG=$DEBUG
fi

# Required ENV for CI
# NPM_USERNAME
# NPM_PASSWORD
# NPM_EMAIL

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

! psql --host="$DATABASE_HOST" --username="$DATABASE_USERNAME" -c 'CREATE DATABASE test;';

mkdir -p coverage
# User -g 'some string' to cause mocha to run only those tests with a matching 'it'
export NODE_ENV="development"
node_modules/.bin/istanbul cover --include-all-sources --report html ./node_modules/.bin/_mocha -- -w --timeout 10000 --recursive --reporter spec test/configure.js test/
node_modules/.bin/istanbul report text-summary > coverage/text-summary.txt
node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95
