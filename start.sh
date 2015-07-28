#!/bin/bash
echo $NODE_ENV
if [ "$NODE_ENV" == "development" ]; then
    npm run development
else
    npm start
fi

