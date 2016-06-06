#!/bin/bash

set -e

ENVIRONMENT=$1

echo ""
echo "Installing awscli"
sudo pip install --upgrade docker-py\<1.2 requests\<2.7 awscli

BRANCH=`echo ${CIRCLE_BRANCH//\//_}`
TAG="web-backend-$ENVIRONMENT-$BRANCH-$CIRCLE_BUILD_NUM"

echo ""
echo "Installing npm dependencies"
./npm-login.sh && npm install --silent

echo ""
echo "Building initial image"
docker build -t "66pix/web-backend:$TAG-layered" .

echo ""
echo "Saving initial image to disk"
docker save "66pix/web-backend:$TAG-layered" > layered.tar

echo ""
echo "Squashing image"
sudo docker-squash -i layered.tar -o squashed.tar -t "66pix/web-backend:$TAG"

echo ""
echo "Loading squashed image"
cat squashed.tar | docker load

echo ""
echo "Pushing squashed image"
docker push "66pix/web-backend:$TAG"

echo ""
echo "Creating deployment Dockerrun.aws.json file"
DOCKERRUN_FILE="$TAG-Dockerrun.aws.json"
sed "s/<TAG>/$TAG/" < Dockerrun.aws.json.template > $DOCKERRUN_FILE

DEPLOYMENT_ARTIFACT="$TAG-bundle.zip"
echo ""
echo "Creating deployment artifact"
zip -r $DEPLOYMENT_ARTIFACT .ebextensions $DOCKERRUN_FILE

echo ""
echo "Uploading deployement $DEPLOYMENT_ARTIFACT to S3"
EB_BUCKET=elasticbeanstalk-ap-southeast-2-482348613934
aws s3 cp $DEPLOYMENT_ARTIFACT s3://$EB_BUCKET/$DEPLOYMENT_ARTIFACT \
  --region ap-southeast-2

echo ""
echo "Creating application version"
aws elasticbeanstalk create-application-version \
  --application-name "${ENVIRONMENT}-66pix" \
  --version-label $TAG \
  --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DEPLOYMENT_ARTIFACT \
  --region ap-southeast-2

echo ""
echo "Updating environment"
# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment \
  --environment-name "${ENVIRONMENT}66pix-backend" \
  --version-label $TAG \
  --region ap-southeast-2
