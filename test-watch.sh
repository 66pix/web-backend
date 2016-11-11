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

export PORT=3022
export NODE_ENV="development"

export RDS_USERNAME=$RDS_USERNAME
export RDS_HOSTNAME=$RDS_HOSTNAME
export RDS_PASSWORD=$RDS_PASSWORD
export RDS_PORT=$RDS_PORT
export RDS_DB_NAME=$RDS_DB_NAME

export TOKEN_SECRET=$TOKEN_SECRET
export RESET_PASSWORD_TOKEN_SECRET=$RESET_PASSWORD_TOKEN_SECRET
export CONTAINER_CODE_SALT="CONTAINER_CODE_SALT"
export BASE_URL="BASE_URL"
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

export CDN_URL="//images.cdn.staging.66pix.com"

export AWS_SQS_DOWNLOAD_ID="123"
export AWS_SQS_DOWNLOAD_SECRET="123"
export AWS_SQS_DOWNLOAD_REGION="us-east-2"
export AWS_SQS_DOWNLOAD_URL="123"

export BRAINTREE_MERCHANT_ID="123"
export BRAINTREE_PRIVATE_KEY="456"
export BRAINTREE_PUBLIC_KEY="456"

echo "! psql --host=$RDS_HOSTNAME --username=$RDS_USERNAME -c 'DROP DATABASE IF EXISTS $RDS_DB_NAME;';"
psql --host="$RDS_HOSTNAME" --username="$RDS_USERNAME" -c 'DROP DATABASE IF EXISTS '"$RDS_DB_NAME"';';
echo "! psql --host=$RDS_HOSTNAME --username=$RDS_USERNAME -c 'CREATE DATABASE $RDS_DB_NAME;';"
psql --host="$RDS_HOSTNAME" --username="$RDS_USERNAME" -c 'CREATE DATABASE '"$RDS_DB_NAME"';';

COVERAGE_DIR=coverage/raw
REMAP_DIR=coverage/typescript

mkdir -p $COVERAGE_DIR
mkdir -p $REMAP_DIR

echo "Running tests"
nodemon -e ts -i d.ts --watch typescript \
  -x "npm run build && node_modules/.bin/istanbul cover --dir $COVERAGE_DIR node_modules/.bin/_mocha -- --timeout 15000 --recursive --reporter spec typescript/test/configure.js typescript/test/"

echo ""
echo "Remapping coverage reports for typescript"
node_modules/.bin/remap-istanbul -i $COVERAGE_DIR/coverage.json -o $REMAP_DIR -t html
node_modules/.bin/remap-istanbul -i $COVERAGE_DIR/coverage.json -o $REMAP_DIR/coverage.json -t json

echo ""
echo "Coverage report located at $REMAP_DIR/index.html"

COVERAGE_AVERAGE=80
echo ""
echo "Enforcing coverage average of $COVERAGE_AVERAGE for $REMAP_DIR/coverage.json"
echo ""
node_modules/.bin/istanbul check-coverage \
  --statements $COVERAGE_AVERAGE \
  --functions $COVERAGE_AVERAGE \
  --branches $COVERAGE_AVERAGE \
  --lines $COVERAGE_AVERAGE \
  $REMAP_DIR/coverage.json
