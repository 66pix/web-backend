import {api} from '@66pix/api'
import {initialiseModels} from '@66pix/models'
import * as cors from 'cors'
import * as express from 'express'
import {config} from './config.js'
import {isRevoked} from './isRevoked'

import {initialiseRaven} from './raven'
import {forgotPassword} from './routes/authentication/forgot-password'

import {login} from './routes/authentication/login'
import {logout} from './routes/authentication/logout'
import {resetPassword} from './routes/authentication/reset-password'
import expressJwt = require('express-jwt')
import bodyparser = require('body-parser')
const debug = require('debug')('backend')
const Raven = initialiseRaven(require('raven'))

let app = express()

const corsOptions = {
  origin: config.get('CORS_URLS').split(',')
}
app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

app.use(bodyparser.json())

app.disable('x-powered-by')

app.use((
  req,
  res,
  next
) => {
  res.setHeader('Cache-Control', 'max-age=0')
  next()
})

app.use('/api', expressJwt({
  secret: config.get('TOKEN_SECRET'),
  isRevoked: isRevoked
}))

export const getApp = initialiseModels
.then((models) => {
  login(app, models)
  logout(app, models)
  forgotPassword(app, models)
  resetPassword(app, models)
  return api(app)
})
.then(() => {
  app.use(unauthorisedErrorHandler)
  app.use(Raven.requestHandler())
  app.use(catchAllErrorHandler)
  return app
})

function unauthorisedErrorHandler (
  error,
  req,
  res,
  next
) {
  if (error.name !== 'UnauthorizedError') {
    return next(error)
  }

  debug(error)
  res.status(401)
  return res.json({
    message: error.message
  })
}

function catchAllErrorHandler (
  error,
  req,
  res,
  next
) {
  let code = 500

  debug(error)
  debug('Reporting catchAllErrorHandler')
  Raven.captureException(error, () => {
    res.status(code)
    debug('Reported catchAllErrorHandler')
    res.json({
      message: res.sentry
    })
  })
}
