import {initialiseModels} from '@66pix/models'

export function isRevoked(request, payload, done) {
  if (!payload) {
    return done(null, true)
  }

  if (payload.iss !== '66pix Website') {
    return done(null, true)
  }

  if (payload.aud !== '66pix Website User') {
    return done(null, true)
  }

  return initialiseModels
  .then((models) => {
    return models.Token.findById(payload.tokenId)
  })
  .then((token) => {
    if (!token) {
      return done(null, true)
    }
    done(null, token.isRevoked)
    return null
  })
};
