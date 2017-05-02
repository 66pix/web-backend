import path = require('path')
import {config} from './config'
import * as R from 'ramda'

let Raven

export function clearRaven() {
  Raven = null
}

export function initialiseRaven(_Raven_): any {
  if (Raven) {
    return Raven
  }

  if (config.get('ENVIRONMENT') === 'local') {
    Raven = {
      captureException: (error, callback) => callback(),
      errorHandler: R.identity
    }
    return Raven
  }

  Raven = _Raven_
  Raven.config(config.get('RAVEN_URL'), {
    release: '%RELEASE_VERSION%',
    environment: config.get('ENVIRONMENT')
  })
  .install()

  return Raven
}
