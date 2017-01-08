#!/bin/bash

set -o nounset
set -o errexit
set -x

ENVIRONMENT=$1

echo ""
echo "Installing awscli"
pip install --upgrade awscli

docker login -u "$DOCKER_USER" -p "$DOCKER_PASS"

BRANCH=`echo ${LAMBCI_BRANCH//\//_}`
MODULE="web-backend"
NAME="66pix/$MODULE"
TAG="$ENVIRONMENT-$BRANCH-l-$LAMBCI_BUILD_NUM-layered"
TAG_SQUASHED="$ENVIRONMENT-$BRANCH-l-$LAMBCI_BUILD_NUM"
RELEASE_VERSION="${MODULE}-${TAG_SQUASHED}"

echo ""
echo "Setting release version in ./typescript/raven.(j|t)s"
sed -i -- "s/%RELEASE_VERSION/${RELEASE_VERSION}/g" typescript/raven.js
sed -i -- "s/%RELEASE_VERSION/${RELEASE_VERSION}/g" typescript/raven.ts

echo ""
echo "Building image"
docker build -t "${NAME}:${TAG_SQUASHED}" .

echo ""
echo "Pushing image"
docker push "${NAME}:${TAG_SQUASHED}"

echo ""
echo "Creating deployment Dockerrun.aws.json file"
DOCKERRUN_FILE="Dockerrun.aws.json"
sed "s/<TAG>/${TAG_SQUASHED}/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE

DEPLOYMENT_ARTIFACT="${MODULE}-${TAG_SQUASHED}-bundle.zip"
echo ""
echo "Creating deployment artifact"
zip -r $DEPLOYMENT_ARTIFACT .ebextensions $DOCKERRUN_FILE

export AWS_ACCESS_KEY_ID=$AWS_ELASTIC_BEANSTALK_DEPLOY_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_ELASTIC_BEANSTALK_DEPLOY_ACCESS_KEY_SECRET
export AWS_DEFAULT_REGION="ap-southeast-2"

echo "UPLOADING TO EB"

echo ""
echo "Uploading deployement $DEPLOYMENT_ARTIFACT to S3"
AWS_EB_BUCKET=elasticbeanstalk-ap-southeast-2-482348613934
aws s3 cp $DEPLOYMENT_ARTIFACT s3://$AWS_EB_BUCKET/$DEPLOYMENT_ARTIFACT \
  --region ap-southeast-2

echo ""
echo "Creating application version"
aws elasticbeanstalk create-application-version \
  --application-name "${ENVIRONMENT}-66pix" \
  --version-label "${MODULE}-${TAG_SQUASHED}" \
  --source-bundle S3Bucket=$AWS_EB_BUCKET,S3Key=$DEPLOYMENT_ARTIFACT \
  --region ap-southeast-2

echo ""
echo "Updating environment"
# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment \
  --environment-name "${ENVIRONMENT}66pix-backend" \
  --version-label "${MODULE}-${TAG_SQUASHED}" \
  --region ap-southeast-2

echo ""
echo "Publishing new release to getsentry"
curl https://sentry.io/api/hooks/release/builtin/127415/3ca3d452f29047deb7b1a443bcffa80c10c5dc8e5ff7ea92a0200ad18a7f655f/ \
  -X POST \
  -H 'Content-Type: application/json' \
  -d "{\"version\": \"${RELEASE_VERSION}\"}"
