'use strict';
var convict = require('convict');
var config = convict({
    NODE_ENV: {
        doc: 'The applicaton environment.',
        format: [
            'production',
            'development',
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
    AWS_S3_BUCKET: {
        doc: 'The S3 image upload bucket',
        format: String,
        default: null,
        env: 'AWS_S3_BUCKET'
    },
    AWS_S3_KEY: {
        doc: 'The S3 image upload IAM key',
        format: String,
        default: null,
        env: 'AWS_S3_KEY'
    },
    AWS_S3_SECRET: {
        doc: 'The S3 image upload IAM secret',
        format: String,
        default: null,
        env: 'AWS_S3_SECRET'
    },
    AWS_S3_REGION: {
        doc: 'The S3 image upload region',
        format: String,
        default: null,
        env: 'AWS_S3_REGION'
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
//# sourceMappingURL=config.js.map