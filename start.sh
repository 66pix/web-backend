#!/bin/bash
nginx
if [ "$NODE_ENV" == "development" ]; then
    npm run development
else
    npm start
fi

