import jwt = require('jsonwebtoken');
const debug = require('debug')('66pix-backend:authentication/login');
import {config} from '../../config';
import Bluebird = require('bluebird');
import Joi = require('joi');
const Celebrate = require('celebrate');
import {IModels} from '@66pix/models';

export function login(app, models: IModels) {
  app.post('/authentication/login', Celebrate({
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }), (req, res) => {
    // Query for pending user, if found set password and continue
    // If not found, continue with normal login attempt
    models.UserAccount.findOne({
      where: {
        email: req.body.email,
        status: 'Pending'
      }
    })
    .then((pendingUser) => {
      if (pendingUser) {
        pendingUser.password = req.body.password;
        pendingUser.status = 'Active';
        return pendingUser.save();
      }
      return;
    })
    .then(() => models.UserAccount.login(req.body.email, req.body.password))
    .then((user) => {
      return Bluebird.props({
        user: user,
        token: models.Token.build({
          userAccountId: user.id,
          userAgent: req.headers['user-agent'],
          type: 'Login',
          isRevoked: false,
          payload: '',
          updatedWithToken: -1
        })
        .save()
      });
    })
    .then((result: any) => {
      let EXPIRES_IN_HOURS = 5;
      let jwtToken = jwt.sign({
        id: result.user.id,
        tokenId: result.token.id
      }, config.get('TOKEN_SECRET'), {
        expiresIn: EXPIRES_IN_HOURS + 'h',
        issuer: '66pix Website',
        audience: '66pix Website User'
      });

      let expiresOn = new Date();
      result.token.expiresOn = expiresOn.getTime() + EXPIRES_IN_HOURS * 60 * 60 * 1000;
      result.token.updatedWithToken = result.token.id;
      // result.token.payload = jwtToken;  // This is a security vulnerability - secrets should never be stored
      return Bluebird.props({
        jwtToken: jwtToken,
        tokenSave: result.token.save()
      });
    })
    .then((result: any) => {
      res.json({
        token: result.jwtToken
      });
    })
    .catch((error) => {
      debug(error);
      res.status(error.code)
      .json({
        code: error.code,
        message: error.message
      });
    });
  });
};
