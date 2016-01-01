'use strict';
var crypto = require('crypto');
var moment = require('moment');
var path = require('path');

var config = require('../../config.js');

var s3Url = 'https://' + config.get('AWS_S3_BUCKET') + '.s3-' + config.get('AWS_S3_REGION') + '.amazonaws.com';

module.exports = function(app) {
  app.post('/upload/signing', function(req, res) {

    if (!req.body || !req.body.filename || !req.body.directory) {
      return res.status(400).send('Bad Request');
    }

    var fileName = req.body.filename;
    var directory = req.body.directory;
    var filePath = path.join(directory, fileName);

    var readType = 'private';

    var expiration = moment().add(15, 'm').toDate();

    var s3Policy = {
      expiration: expiration,
      conditions: [
        {
          bucket: config.get('AWS_S3_BUCKET')
        },
        [
          'starts-with',
          '$key',
          filePath
        ],
        {
          acl: readType
        },
        {
          success_action_status: '201' // eslint-disable-line camelcase
        },
        [
          'starts-with',
          '$Content-Type',
          req.body.type
        ],
        [
          'content-length-range',
          2048,
          10485760
        ]
      ]
    };

    var stringPolicy = JSON.stringify(s3Policy);
    var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

    var signature = crypto
    .createHmac('sha1', config.get('AWS_S3_SECRET'))
    .update(new Buffer(base64Policy, 'utf-8'))
    .digest('base64');

    var credentials = {
      url: s3Url,
      fields: {
        key: filePath,
        AWSAccessKeyId: config.get('AWS_S3_KEY'),
        acl: readType,
        policy: base64Policy,
        signature: signature,
        'Content-Type': req.body.type,
        success_action_status: 201 // eslint-disable-line camelcase
      }
    };
    res.jsonp(credentials);
  });
};
