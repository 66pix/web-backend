#!/bin/bash

usage()
{
cat << EOF
usage: $0 options

This script runs tests and watch for changes

OPTIONS:
   -u      postgres database user (defaults to "postgres")
   -h      postgres host (defaults to "postgres")
   -p      postgres port (defaults to "5432")
   -P      postgres password
   -s      token secret (defaults to TOKEN_SECRET environment variable)
   -d      debug string (defaults to "") use "*" to output verbose debug information
   -D      database name
EOF
}

RDS_USERNAME="postgres"
RDS_HOST="localhost"
RDS_PORT="5432"
DATABASE="test"
RDS_PASSWORD=""
TOKEN_SECRET="TOKEN_SECRET"
RESET_PASSWORD_TOKEN_SECRET="RESET_PASSWORD_TOKEN_SECRET"
DEBUG=
while getopts "u:h:d:s:p:P:D:r:" OPTION
do
     case $OPTION in
         h)
             RDS_HOST=$OPTARG
             ;;
         u)
             RDS_USERNAME=$OPTARG
             ;;
         P)
             RDS_PASSWORD=$OPTARG
             ;;
         p)
             RDS_PORT=$OPTARG
             ;;
         d)
             DEBUG=$OPTARG
             ;;
         D)
             DATABASE=$OPTARG
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
export RDS_USERNAME=$RDS_USERNAME
export RDS_HOST=$RDS_HOST
export RDS_PASSWORD=$RDS_PASSWORD
export RDS_PORT=$RDS_PORT
export TOKEN_SECRET=$TOKEN_SECRET
export DEBUG=$DEBUG
export DATABASE=$DATABASE
export TOKEN_SECRET=$TOKEN_SECRET
export RESET_PASSWORD_TOKEN_SECRET=$RESET_PASSWORD_TOKEN_SECRET

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

echo "! psql --host=$RDS_HOST --username=$RDS_USERNAME -c 'DROP DATABASE $DATABASE;';"
! psql --host="$RDS_HOST" --username="$RDS_USERNAME" -c 'DROP DATABASE '"$DATABASE"';';
echo "! psql --host=$RDS_HOST --username=$RDS_USERNAME -c 'CREATE DATABASE $DATABASE;';"
! psql --host="$RDS_HOST" --username="$RDS_USERNAME" -c 'CREATE DATABASE '"$DATABASE"';';

mkdir -p coverage

# User -g 'some string' to cause mocha to run only those tests with a matching 'it'
node_modules/.bin/istanbul cover --include-all-sources --report html ./node_modules/.bin/_mocha -- -w --timeout 10000 --recursive --reporter spec test/configure.js test/
node_modules/.bin/istanbul report text-summary > coverage/text-summary.txt
node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95
