#!/bin/bash
set -e

/sbin/postgres-start.sh

echo "! psql --host=$RDS_HOSTNAME --username=$RDS_USERNAME -c 'CREATE DATABASE $RDS_DB_NAME;';"
! psql --host="$RDS_HOSTNAME" --username="$RDS_USERNAME" -c 'CREATE DATABASE '"$RDS_DB_NAME"';';

COVERAGE_DIR=coverage/raw
REMAP_DIR=coverage/typescript

mkdir -p $COVERAGE_DIR
mkdir -p $REMAP_DIR

echo "Running tests"
npm run build && node_modules/.bin/istanbul cover --dir $COVERAGE_DIR node_modules/.bin/_mocha -- --timeout 20000 --recursive --reporter spec typescript/test/configure.js typescript/test/

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
