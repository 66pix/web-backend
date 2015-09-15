'use strict';

var debug = require('debug')('authentication/forgot-password');

module.exports = function(app) {

  function responseSuccess(res) {
    res.status(200)
      .json({
        message: 'Please check your email'
      });
  }

  require('@faceleg/66pix-models').then(function(models) {
    app.post('/authentication/forgot-password', function(req, res) {
      if (!req.body.email) {
        return res.status(400)
          .json({
            code: 400,
            message: 'Email is required'
          });
      }
      models.User.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(function(user) {
        if (user) {
          // send email
          return responseSuccess(res);
        }

        responseSuccess(res);
      });
    });
  });
};

