'use strict';

var convict = require('convict');

var config = convict({
  NODE_ENV: {
    doc: 'The applicaton environment.',
    format: [
      'production',
      'development',
      'staging',
      'test'
    ],
    default: 'development',
    env: 'NODE_ENV'
  },
  PORT: {
    doc: 'The port to bind.',
    format: Number,
    default: null,
    env: 'PORT'
  },
  TOKEN_SECRET: {
    doc: 'The JWT token secret.',
    format: String,
    default: null,
    env: 'TOKEN_SECRET'
  },
  RESET_PASSWORD_TOKEN_SECRET: {
    doc: 'The JWT reset password token secret.',
    format: String,
    default: null,
    env: 'RESET_PASSWORD_TOKEN_SECRET'
  },
  CDN_URL: {
    doc: 'The URL for the site CDN',
    format: String,
    default: null,
    env: 'CDN_URL'
  },
  BASE_URL: {
    doc: 'The site URL for the environment\'s website',
    format: String,
    default: null,
    env: 'BASE_URL'
  }
});

config.validate({
  strict: true
});

module.exports = config;

