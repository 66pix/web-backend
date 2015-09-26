#!/bin/bash

usage()
{
cat << EOF
usage: $0 options

This script runs tests and watch for changes

OPTIONS:
   -h      Show this message
   -u      postgres database user (defaults to "postgres")
   -d      postgres host (defaults to "postgres")
   -s      token secret (defaults to TOKEN_SECRET environment variable)
   -r      reset password token secret (defaults to RESET_PASSWORD_TOKEN_SECRET environment variable)
EOF
}

DATABASE_USERNAME=
DATABASE_HOST=
TOKEN_SECRET=
RESET_PASSWORD_TOKEN_SECRET=
while getopts "hu:d:s:r:" OPTION
do
     case $OPTION in
         h)
             usage
             exit 1
             ;;
         u)
             DATABASE_USERNAME=$OPTARG
             ;;
         d)
             DATABASE_HOST=$OPTARG
             ;;
         s)
             TOKEN_SECRET=$OPTARG
             ;;
         r)
             RESET_PASSWORD_TOKEN_SECRET=$OPTARG
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
fi

if [ ! -z $RESET_PASSWORD_TOKEN_SECRET ]; then
    export RESET_PASSWORD_TOKEN_SECRET=$RESET_PASSWORD_TOKEN_SECRET
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

echo "! psql --host=$DATABASE_HOST --username=$DATABASE_USERNAME -c 'CREATE DATABASE test;';"
! psql --host="$DATABASE_HOST" --username="$DATABASE_USERNAME" -c 'CREATE DATABASE test;';

mkdir -p coverage
node_modules/.bin/istanbul cover -x gulpfile.js --include-all-sources --report html ./node_modules/.bin/_mocha -- -w  --recursive --reporter spec
node_modules/.bin/istanbul report text-summary > coverage/text-summary.txt
node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95
