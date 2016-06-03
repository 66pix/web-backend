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
export PRODUCT_CODE_SALT="PRODUCT_CODE_SALT"
export BASE_URL="BASE_URL"
export DEBUG=$DEBUG

export EMAIL_HOST="localhost"
export EMAIL_PASSWORD="email password"
export EMAIL_USERNAME="email username"
export EMAIL_PORT=1231
export EMAIL_FROM="testing@66pix.com"

export CDN_URL="//images.cdn.staging.66pix.com"

export AWS_SQS_DOWNLOAD_ID="123"
export AWS_SQS_DOWNLOAD_SECRET="123"
export AWS_SQS_DOWNLOAD_REGION="us-east-2"
export AWS_SQS_DOWNLOAD_URL="123"

export BRAINTREE_MERCHANT_ID="123"
export BRAINTREE_PRIVATE_KEY="456"
export BRAINTREE_PUBLIC_KEY="456"

echo "! psql --host=$RDS_HOSTNAME --username=$RDS_USERNAME -c 'DROP DATABASE $RDS_DB_NAME;';"
! psql --host="$RDS_HOSTNAME" --username="$RDS_USERNAME" -c 'DROP DATABASE '"$RDS_DB_NAME"';';
echo "! psql --host=$RDS_HOSTNAME --username=$RDS_USERNAME -c 'CREATE DATABASE $RDS_DB_NAME;';"
! psql --host="$RDS_HOSTNAME" --username="$RDS_USERNAME" -c 'CREATE DATABASE '"$RDS_DB_NAME"';';

mkdir -p coverage

nodemon -e js,ts --watch typescript \
  -x 'npm run build && node_modules/.bin/istanbul cover --report html node_modules/.bin/_mocha -- --timeout 10000 --recursive --reporter spec javascript/test/configure.js javascript/test/ && node_modules/.bin/istanbul report text-summary > coverage/text-summary.txt && node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95'
