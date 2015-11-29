'use strict';

var env = require('envalid');

env.validate(process.env, {
  NODE_ENV: {
    required: true,
    choices: [
      'production',
      'development'
    ]
  },
  PORT: {
    required: true,
    parse: env.isNumber
  },
  TOKEN_SECRET: {
    required: true,
    help: 'The JWT token secret'
  },
  RESET_PASSWORD_TOKEN_SECRET: {
    required: true,
    help: 'The JWT reset password token secret'
  }
});

