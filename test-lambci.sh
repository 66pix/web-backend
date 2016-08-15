#!/bin/bash

set -o nounset
set -o errexit

/sbin/postgres-start.sh

npm run nsp
npm run build
npm run lint

export NODE_ENV="development"
export RDS_PORT="5432"
export RDS_USERNAME="postgres"
export RDS_PASSWORD=""
export RDS_HOSTNAME="localhost"
export RDS_DB_NAME="test"
export CONTAINER_CODE_SALT="CONTAINER_CODE_SALT"

export PORT=3000

export TOKEN_SECRET="TOKEN_SECRET"

export EMAIL_HOST="localhost"
export EMAIL_PASSWORD="username"
export EMAIL_USERNAME="password"
export EMAIL_PORT=1231
export EMAIL_FROM="testing@66pix.com"
export BASE_URL="https://staging.66pix.com"

export CONTAINER_CODE_SALT="CONTAINER_CODE_SALT"

export CDN_URL="//images.cdn.staging.66pix.com"

export AWS_SQS_DOWNLOAD_ID="123"
export AWS_SQS_DOWNLOAD_SECRET="123"
export AWS_SQS_DOWNLOAD_REGION="us-east-2"
export AWS_SQS_DOWNLOAD_URL="123"

export AWS_S3_BUCKET="AWS_S3_BUCKET"
export AWS_S3_REGION="ap-southeast-2"
export AWS_S3_SECRET="AWS_S3_SECRET"
export AWS_S3_KEY="AWS_S3_KEY"

export BRAINTREE_MERCHANT_ID="123"
export BRAINTREE_PRIVATE_KEY="456"
export BRAINTREE_PUBLIC_KEY="456"

npm run test

if [ "$LAMBCI_BRANCH" != "develop" ] && [ "$LAMBCI_BRANCH" != "master" ]; then
  echo "Deployment only triggered for develop or master, build was for $LAMBCI_BRANCH"
  exit 0
fi

ENVIRONMENT="staging"
if [ "$LAMBCI_BRANCH" == "master" ]; then
  ENVIRONMENT="production"
fi

./deploy.sh "$ENVIRONMENT"
