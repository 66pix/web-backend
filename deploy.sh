#!/bin/bash

set -e

ENVIRONMENT=$1

echo "Installing awscli"
sudo pip install --upgrade docker-py\<1.2 requests\<2.7 awscli

BRANCH=`echo ${CIRCLE_BRANCH//\//_}`
TAG="$ENVIRONMENT-$BRANCH-$CIRCLE_BUILD_NUM"

echo "Building initial image"
docker build --build-arg NPM_AUTH_TOKEN="$NPM_AUTH_TOKEN" -t "66pix/web-backend:$TAG-layered" .

echo "Saving initial image to disk"
docker save "66pix/web-backend:$TAG-layered" > layered.tar

echo "Squashing image"
sudo docker-squash -i layered.tar -o squashed.tar -t "66pix/web-backend:$TAG"

echo "Loading squashed image"
cat squashed.tar | docker load

echo "Pushing squashed image"
docker push "66pix/web-backend:$TAG"

echo "Creating deployment Dockerrun.aws.json file"
DOCKERRUN_FILE="$TAG-Dockerrun.aws.json"
sed "s/<TAG>/$TAG/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE

echo "Uploading deployement Dockerrun.aws.json to S3"
EB_BUCKET=elasticbeanstalk-ap-southeast-2-482348613934
aws s3 cp $DOCKERRUN_FILE s3://$EB_BUCKET/$DOCKERRUN_FILE \
  --region ap-southeast-2

echo "Creating application version"
aws elasticbeanstalk create-application-version \
  --application-name "${ENVIRONMENT}-66pix" \
  --version-label $TAG \
  --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_FILE \
  --region ap-southeast-2

echo "Updating environment"
# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment \
  --environment-name "${ENVIRONMENT}66pix-backend" \
  --version-label $TAG \
  --region ap-southeast-2
