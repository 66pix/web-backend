import http = require('http')
import debugModule = require('debug')
const debug = debugModule('66pix-backend:index')
import {config} from './config'
import {getApp} from './app'

import {initialiseRaven} from './raven'
const Raven = initialiseRaven(require('raven'))

const handleError = (error) => {
  debug(error.message)
  debug(error.stack)

  debug('Reporting handleError')

  Raven.captureException(error, (
    ravenError,
    eventId
  ) => {
    if (ravenError) {
      debug('Failed to report error')
      debug(ravenError)
    } else {
      debug('Reported handleError')
    }

    debug(eventId)
    process.exit()
  })
}

/* istanbul ignore next */
process.on('unhandledRejection', handleError)

let d = require('domain').create()
/* istanbul ignore next */
d.on('error', handleError)

export const getServer = getApp.then((app) => {
  return http.createServer(app as any)
  .listen(config.get('PORT'))
})
