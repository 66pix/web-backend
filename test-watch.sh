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
RDS_HOSTNAME="localhost"
RDS_PORT="5432"
RDS_DB_NAME="test"
RDS_PASSWORD=""
TOKEN_SECRET="TOKEN_SECRET"
RESET_PASSWORD_TOKEN_SECRET="RESET_PASSWORD_TOKEN_SECRET"
DEBUG=
while getopts "u:h:d:s:p:P:D:r:" OPTION
do
     case $OPTION in
         h)
             RDS_HOSTNAME=$OPTARG
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
             RDS_DB_NAME=$OPTARG
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

export PORT=3021
export NODE_ENV="development"

export RDS_USERNAME=$RDS_USERNAME
export RDS_HOSTNAME=$RDS_HOSTNAME
export RDS_PASSWORD=$RDS_PASSWORD
export RDS_PORT=$RDS_PORT
export RDS_DB_NAME=$RDS_DB_NAME

export TOKEN_SECRET=$TOKEN_SECRET
export RESET_PASSWORD_TOKEN_SECRET=$RESET_PASSWORD_TOKEN_SECRET
export DEBUG=$DEBUG

export EMAIL_HOST="localhost"
export EMAIL_PASSWORD="email password"
export EMAIL_USERNAME="email username"
export EMAIL_PORT=1231
export EMAIL_FROM="testing@66pix.com"

export AWS_S3_BUCKET="AWS_S3_BUCKET"
export AWS_S3_REGION="ap-southeast-2"
export AWS_S3_SECRET="AWS_S3_SECRET"
export AWS_S3_KEY="AWS_S3_KEY"

export CDN_URL="//cdn.images.staging.66pix.com"

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

echo "! psql --host=$RDS_HOSTNAME --username=$RDS_USERNAME -c 'DROP DATABASE $RDS_DB_NAME;';"
! psql --host="$RDS_HOSTNAME" --username="$RDS_USERNAME" -c 'DROP DATABASE '"$RDS_DB_NAME"';';
echo "! psql --host=$RDS_HOSTNAME --username=$RDS_USERNAME -c 'CREATE DATABASE $RDS_DB_NAME;';"
! psql --host="$RDS_HOSTNAME" --username="$RDS_USERNAME" -c 'CREATE DATABASE '"$RDS_DB_NAME"';';

mkdir -p coverage

# User -g 'some string' to cause mocha to run only those tests with a matching 'it'
node_modules/.bin/istanbul cover --include-all-sources --report html node_modules/.bin/_mocha -- -w --timeout 5000 --recursive --reporter spec test/configure.js test/
node_modules/.bin/istanbul report text-summary > coverage/text-summary.txt
node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95
