#!/bin/bash

set -o nounset
set -o errexit

ENVIRONMENT=$1

echo ""
echo "Installing awscli"
pip install --upgrade awscli

docker login -e "$DOCKER_EMAIL" -u "$DOCKER_USER" -p "$DOCKER_PASS"

BRANCH=`echo ${LAMBCI_BRANCH//\//_}`
MODULE="web-backend"
NAME="66pix/$MODULE"
TAG="$ENVIRONMENT-$BRANCH-l-$LAMBCI_BUILD_NUM-layered"
TAG_SQUASHED="$ENVIRONMENT-$BRANCH-l-$LAMBCI_BUILD_NUM"

echo ""
echo "Building assets"
CDN_DOMAIN="assets.cdn.staging.66pix.com"
if [ "$ENVIRONMENT" == "master" ]; then
  CDN_DOMAIN="assets.cdn.66pix.com"
fi

./node_modules/.bin/gulp build --${ENVIRONMENT} --cdn-domain "${CDN_DOMAIN}"

echo ""
echo "Stripping tests"
rm -rf public/test

# Commenting squashing out until I have the weeks or months required to get it going in LambCI
# echo ""
# echo "Building layered image"
# docker build --build-arg BACKEND_HOST="backend.${ENVIRONMENT}.66pix.com:443" -t "${NAME}:${TAG}" .

# echo ""
# echo "Saving layered image to disk"
# docker save "${NAME}:${TAG}" > layered.tar

# echo ""
# echo "Squashing layered image"
# docker-squash -i layered.tar -o squashed.tar -t "${NAME}:${TAG_SQUASHED}" -verbose -from root

# echo ""
# echo "Loading squashed image"
# cat squashed.tar | docker load

# echo ""
# echo "Pushing squashed image"
# docker push "${NAME}:${TAG_SQUASHED}"

echo ""
echo "Building image"
docker build --build-arg BACKEND_HOST="backend.${ENVIRONMENT}.66pix.com:443" -t "${NAME}:${TAG_SQUASHED}" .

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
zip -r $DEPLOYMENT_ARTIFACT $DOCKERRUN_FILE

export AWS_ACCESS_KEY_ID=$AWS_ELASTIC_BEANSTALK_DEPLOY_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_ELASTIC_BEANSTALK_DEPLOY_ACCESS_KEY_SECRET
export AWS_DEFAULT_REGION="ap-southeast-2"

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
