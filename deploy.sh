#!/bin/bash

set -e

ENVIRONMENT=$1
BRANCH=`echo ${CIRCLE_BRANCH//\//_}`
TAG="$ENVIRONMENT-$BRANCH-$CIRCLE_BUILD_NUM"

docker build --build-arg NPM_AUTH_TOKEN="$NPM_AUTH_TOKEN" -t "66pix/web-backend:$TAG-layered" .
docker images
docker save "66pix/web-backend:$TAG-layered" > layered.tar
sudo docker-squash -i layered.tar -o squashed.tar -t "66pix/web-backend:$TAG"
cat squashed.tar | docker load
docker images
docker push "66pix/web-backend:$TAG"
sudo pip install --upgrade docker-py\<1.2 requests\<2.7 awscli
      # - cd .deploy && eb init -r ap-southeast-2 $ENVIRONMENT-66pix
      # - cd .deploy && eb deploy $ENVIRONMENT66pix-backend --profile default -l $CIRCLE_BUILD_NUM

EB_BUCKET=elasticbeanstalk-ap-southeast-2-482348613934

# Create new Elastic Beanstalk version
DOCKERRUN_FILE="$TAG-Dockerrun.aws.json"

sed "s/<TAG>/$TAG/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE

aws s3 cp $DOCKERRUN_FILE s3://$EB_BUCKET/$DOCKERRUN_FILE \
  --region ap-southeast-2

aws elasticbeanstalk create-application-version \
  --application-name "${ENVIRONMENT}-66pix" \
  --version-label $TAG \
  --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_FILE \
  --region ap-southeast-2

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment \
  --environment-name "${ENVIRONMENT}66pix-backend" \
  --version-label $TAG \
  --region ap-southeast-2
Amaz
